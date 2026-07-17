"use server";

import { getLocale, getTranslations } from "@/i18n/server";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getRequestOrigin } from "@/lib/url";
import { createVerificationToken } from "@/lib/verification-token";

export async function resendVerificationAction(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const t = await getTranslations("errors");
  const neutralMessage = t(
    "Hvis kontoen findes og ikke allerede er bekræftet, har vi sendt en ny email.",
  );

  const email = formData.get("email");
  if (typeof email !== "string" || !email) {
    return neutralMessage;
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (user && !user.emailVerified) {
    const rawToken = await createVerificationToken(user.id);
    const origin = await getRequestOrigin();
    const verifyUrl = `${origin}/verify-email?token=${rawToken}`;
    const locale = await getLocale();
    try {
      await sendVerificationEmail({ to: user.email, name: user.name, verifyUrl, locale });
    } catch (error) {
      console.error("Failed to resend verification email", error);
    }
  }

  return neutralMessage;
}
