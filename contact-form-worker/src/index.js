import { Resend } from 'resend';

// Verifiy Turnstile token
async function verifyTurnstile(token, secretKey, clientIP) {
  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  formData.append('remoteip', clientIP);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result.success;
}

// Validate form data
function validateFormData(name, email, message) {
	const errors = [];

	if (!name || name.trim().length < 2) {
		errors.push('Name must be at least 2 characters long');
	}

	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.push('Please provide a valid email address');
	}

	if (!message || message.trim().length < 10) {
		errors.push('Message must be at least 10 characters long');
	}

	//Check for potential spam patterns
	const spamPatterns = [
	/viagra|cialis|casino|lottery|bitcoin/i,
	/click here|buy now|limited time/i
	];

  // const fullText = `${name} ${email} ${message}`.toLowerCase();
  // for (const pattern of spamPatterns) {
  //   if (pattern.test(fullText)) {
  //     errors.push('Message appears to contain spam content');
  //     break;
  //   }
  // }

	return errors;
}

// Rate limiting
async function checkRateLimit(clientIP, env) {
  const key = `rate_limit:${clientIP}`;
  const existing = await env.SUBMISSIONS_KV.get(key);
  
  if (existing) {
    const data = JSON.parse(existing);
    const now = Date.now();
    const windowStart = now - (15 * 60 * 1000); // 15 minutes
    
    // Filter recent submissions
    const recentSubmissions = data.submissions.filter(time => time > windowStart);
    
    if (recentSubmissions.length >= 3) { // Max 3 submissions per 15 minutes
      return false;
    }
    
    // Update with new submission
    recentSubmissions.push(now);
    await env.SUBMISSIONS_KV.put(key, JSON.stringify({
      submissions: recentSubmissions
    }), { expirationTtl: 900 }); // 15 minutes TTL
    
  } else {
    // First submission from this IP
    await env.SUBMISSIONS_KV.put(key, JSON.stringify({
      submissions: [Date.now()]
    }), { expirationTtl: 900 });
  }
  
  return true;
}


 // Get allowed origins from environment or default

function getAllowedOrigins(env) {
  if (env.ALLOWED_ORIGINS) {
    return env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
  }
  return ['https://hayounk.com', 'https://www.hayounk.com'];
}


 // Generate CORS headers

function getCorsHeaders(origin, env) {
  const allowedOrigins = getAllowedOrigins(env);
  const isAllowed = allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

// Main

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const corsHeaders = getCorsHeaders(origin, env);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204,
        headers: corsHeaders 
      });
    }

    if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
        status: 405, 
        headers: { 
          'Content-Type': 'application/json',
          'Allow': 'POST',
          ...corsHeaders
        }
      });
		}

		try {
      // Get client IP for rate limiting
      const clientIP = request.headers.get('CF-Connecting-IP') || 
                      request.headers.get('X-Forwarded-For') || 
                      request.headers.get('X-Real-IP') ||
                      'unknown';
      
      // Check rate limit
      const rateLimitOk = await checkRateLimit(clientIP, env);
      if (!rateLimitOk) {
        return new Response(JSON.stringify({ 
          error: 'Too many submissions. Please wait 15 minutes before trying again.' 
        }), {
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Parse form data
      const formData = await request.formData();
      const name = formData.get("name")?.toString().trim();
      const email = formData.get("email")?.toString().trim();
      const message = formData.get("message")?.toString().trim();
      const turnstileToken = formData.get("cf-turnstile-response")?.toString();

      // Validate required fields
      if (!name || !email || !message) {
        return new Response(JSON.stringify({ 
          error: 'All fields are required' 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Verify Turnstile token
      if (!turnstileToken) {
        return new Response(JSON.stringify({ 
          error: 'Captcha verification required' 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      if (!env.TURNSTILE_SECRET_KEY) {
        console.error('TURNSTILE_SECRET_KEY not configured');
        return new Response(JSON.stringify({ 
          error: 'Server configuration error' 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      const turnstileValid = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY);
      if (!turnstileValid) {
        return new Response(JSON.stringify({ 
          error: 'Captcha verification failed' 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Validate form data
      const validationErrors = validateFormData(name, email, message);
      if (validationErrors.length > 0) {
        return new Response(JSON.stringify({ 
          error: validationErrors.join(', ') 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Save submission to KV
      const timestamp = new Date().toISOString();
      const submissionId = `submission:${timestamp}:${Math.random().toString(36).substr(2, 9)}`;
      const submission = { 
        id: submissionId,
        name, 
        email, 
        message, 
        timestamp,
        clientIP,
        userAgent: request.headers.get('User-Agent') || 'unknown',
        origin: origin || 'unknown'
      };

      await env.SUBMISSIONS_KV.put(submissionId, JSON.stringify(submission));

      // Send email via Resend
      let emailSuccess = false;
      let emailError = null;
      
      if (env.RESEND_API_KEY) {
        try {
          const resend = new Resend(env.RESEND_API_KEY);
          const { data, error } = await resend.emails.send({
            from: 'Contact Form <noreply@hayounk.com>', // Use your verified domain
            to: ['hayounkdev@gmail.com'],
            subject: `New Contact Form Submission from ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Contact Form Submission</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Message:</strong></p>
                  <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                <div style="margin-top: 20px; font-size: 12px; color: #666;">
                  <p>Submitted: ${timestamp}</p>
                  <p>IP: ${clientIP}</p>
                  <p>Submission ID: ${submissionId}</p>
                </div>
              </div>
            `
          });

          if (error) {
            console.error('Resend error:', error);
            emailError = error;
          } else {
            emailSuccess = true;
            console.log('Email sent successfully:', data);
          }
        } catch (e) {
          console.error('Email sending failed:', e);
          emailError = e.message;
        }
      }

      // Return success response
      return new Response(JSON.stringify({
        success: true,
        message: emailSuccess 
          ? 'Message sent successfully!' 
          : 'Message received and saved, but email notification failed.',
        submissionId
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
	}
};
