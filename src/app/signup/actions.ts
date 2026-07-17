"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getLocale, getTranslations } from "@/i18n/server";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getRequestOrigin } from "@/lib/url";
import { createVerificationToken } from "@/lib/verification-token";

export async function signupAction(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const t = await getTranslations("errors");

  const signupSchema = z.object({
    organizationName: z.string().min(1, t("Virksomhedsnavn er påkrævet")),
    cvrNumber: z
      .string()
      .trim()
      .regex(/^\d{8}$/, t("CVR-nummer skal være 8 cifre")),
    addressLine1: z.string().min(1, t("Adresse er påkrævet")),
    postalCode: z.string().min(1, t("Postnummer er påkrævet")),
    city: z.string().min(1, t("By er påkrævet")),
    name: z.string().min(1, t("Navn er påkrævet")),
    email: z.string().email(t("Ugyldig email")),
    password: z.string().min(8, t("Adgangskode skal være mindst 8 tegn")),
  });

  const parsed = signupSchema.safeParse({
    organizationName: formData.get("organizationName"),
    cvrNumber: formData.get("cvrNumber"),
    addressLine1: formData.get("addressLine1"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? t("Ugyldige oplysninger");
  }

  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return t("Der findes allerede en konto med denne email");
  }

  const passwordHash = await hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash,
      organization: {
        create: {
          name: parsed.data.organizationName,
          cvrNumber: parsed.data.cvrNumber,
          addressLine1: parsed.data.addressLine1,
          postalCode: parsed.data.postalCode,
          city: parsed.data.city,
        },
      },
    },
  });

  const rawToken = await createVerificationToken(user.id);
  const origin = await getRequestOrigin();
  const verifyUrl = `${origin}/verify-email?token=${rawToken}`;
  const locale = await getLocale();

  try {
    await sendVerificationEmail({ to: user.email, name: user.name, verifyUrl, locale });
  } catch (error) {
    console.error("Failed to send verification email", error);
  }

  redirect(`/signup/check-email?email=${encodeURIComponent(user.email)}`);
}
