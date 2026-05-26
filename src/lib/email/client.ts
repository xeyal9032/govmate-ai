import { Resend } from 'resend';

let resendInstance: Resend | null = null;

export function getEmailClient(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getEmailClient();
  const from = process.env.EMAIL_FROM || 'GovMate AI <noreply@govmate.ai>';

  return resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}
