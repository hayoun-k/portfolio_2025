import { Resend } from 'resend';
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
    return new Response("Method Not Allowed", { status: 405, headers: { 'Allow': 'POST'} });
  }


		const formData = await request.formData();
		const name = formData.get("name");
		const email = formData.get("email");
		const message = formData.get("message");

		const timestamp = new Date().toISOString();
		const key = `submission:${timestamp}`;
		const submission = { name, email, message, timestamp };

		// Save to KV
		await env.SUBMISSIONS_KV.put(key, JSON.stringify(submission));

		// Send email via Resend
		const resend = new Resend(env.RESEND_API_KEY);
			try {
				const { data, error } = await resend.emails.send({
					from: 'HyK <me@hayounk.com>',
					to: ['hayounkdev@gmail.com'],
					subject: `New Contact Form from ${name}`,
					html: `<p><strong>Name:</strong> ${name}</p>
								<p><strong>Email:</strong> ${email}</p>
								<p><strong>Message:</strong> ${message}</p>`
					});


				if (error) {
					return new Response("Saved, but failed to email", { status: 202 });
				}
				return new Response("Form submitted successfully!", { status: 200 });
    } catch (e) {
			return new Response('Internal Error', { status: 500});
		}
	}
};
