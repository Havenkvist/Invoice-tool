import { Resend } from "resend";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { translate } from "@/i18n/dictionaries";

const globalForResend = globalThis as unknown as { resend: Resend | undefined };

export const resend =
  globalForResend.resend ?? new Resend(process.env.RESEND_API_KEY);

if (process.env.NODE_ENV !== "production") {
  globalForResend.resend = resend;
}

const FROM_ADDRESS = "Faktura <onboarding@resend.dev>";

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

export async function sendVerificationEmail(params: {
  to: string;
  name: string;
  verifyUrl: string;
  locale?: Locale;
}) {
  const locale = params.locale ?? DEFAULT_LOCALE;
  const t = (key: string, values?: Record<string, string | number>) =>
    translate(locale, "email", key, values);

  return sendEmail({
    to: params.to,
    subject: t("Bekræft din email"),
    html: `
      <p>${t("Hej %{name},", { name: params.name })}</p>
      <p>${t("Tak for din oprettelse. Bekræft din email for at aktivere din konto:")}</p>
      <p><a href="${params.verifyUrl}">${t("Bekræft email")}</a></p>
      <p>${t("Linket udløber om 24 timer. Hvis du ikke har oprettet en konto, kan du ignorere denne email.")}</p>
    `,
  });
}
