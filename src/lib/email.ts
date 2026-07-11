import { Resend } from "resend";

const globalForResend = globalThis as unknown as { resend: Resend | undefined };

export const resend =
  globalForResend.resend ?? new Resend(process.env.RESEND_API_KEY);

if (process.env.NODE_ENV !== "production") {
  globalForResend.resend = resend;
}

/** Sender address used for all transactional email. */
const FROM_ADDRESS = "Faktura <invoices@yourdomain.dk>";

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}
