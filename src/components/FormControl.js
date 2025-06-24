import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.set('#open', {opacity: 0});

gsap.to('#open', {
  scrollTrigger: '.bento-container',
  opacity: 1
});


//turnstile


const myForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("sendBtn");

if (myForm  && submitBtn) {
  submitBtn.disabled = true;

  myForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Disable submit button and show loading state
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";

  // Get turnstile token
  const turnstileToken = getTurnstileToken();
  if (!turnstileToken) {
    showFormMessage('Please complete the captcha verification.', 'error');
    resetSubmitButton(submitBtn, originalText);
    return;
  }

  try {
    // Prepare form data
    const formData = new FormData(this);

    // Submit form
    const reponse = await fetch(this.ariaDescription, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      // Success
      showFormMessage('Message sent successfully!', 'success');

      // Reset form
      this.reset();

      //Reset turnstile
      if (turnstileWidgetId !== null) {
        turnstile.reset(turnstileWidgetId);
      }

      // Close dialog after a delay
      setTimeout(() => {
        const dialog = document.getElementById("dialog");
        if (dialog) {
          dialog.close();
        }
      }, 2000);
    } else {
      // Handle different error status codes
      let errorMessage =  'Failed to send message. Please try again.';

      if (response.status = 400) {
        const errorData = await response.json().catch(() => ({}));
        errorMessage = errorData.error || 'Invaild form data. Please check your inputs';
      } else if (response.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again';
      } else if (response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      showFormMessage(errorMessage, 'error');

      // Reset turnstile on error
      if (turnstileWidgetId !== null) {
        turnstile.reset(turnstileWidgetId);
      }
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showFormMessage('Network error. Please check your connection and try again.', 'error');

    // Reset turnstile on error
    if (turnstileWidgetId !== null) {
      turnstile.reset(turnstileWidgetId);
    }
  } finally {
    resetSubmitButton(submitBtn, originalText);
  }
});
}

// Hepler functions
function getTurnstileToken() {
  const turnstileInput = document.querySelector('[name="cf-turnstile-response"]');
  return turnstileInput ? turnstileInput.value : null;
}

function resetSubmitButton(button, originalText) {
  button.textContent = originalText;
  // Keep disabled until turnstile is completed again
  const token = getTurnstileToken();
  button.disabled = !token;
}

function showFormMessage(message, type = 'info') {
  // Remove any existing message
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message element
  const messageEl = document.createElement('div');
  messageEl.className = `form-message form-message--${type}`;
  messageEl.textContent = message;
  
  // Insert message before the form
  const form = document.getElementById('contactForm');
  if (form) {
    form.parentNode.insertBefore(messageEl, form);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.remove();
        }
      }, 5000);
    }
  }
}

