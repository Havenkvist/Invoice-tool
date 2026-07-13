"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getRequestOrigin } from "@/lib/url";
import { createVerificationToken } from "@/lib/verification-token";

const signupSchema = z.object({
  organizationName: z.string().min(1, "Virksomhedsnavn er påkrævet"),
  cvrNumber: z
    .string()
    .trim()
    .regex(/^\d{8}$/, "CVR-nummer skal være 8 cifre"),
  addressLine1: z.string().min(1, "Adresse er påkrævet"),
  postalCode: z.string().min(1, "Postnummer er påkrævet"),
  city: z.string().min(1, "By er påkrævet"),
  name: z.string().min(1, "Navn er påkrævet"),
  email: z.string().email("Ugyldig email"),
  password: z.string().min(8, "Adgangskode skal være mindst 8 tegn"),
});

export async function signupAction(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
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
    return parsed.error.issues[0]?.message ?? "Ugyldige oplysninger";
  }

  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return "Der findes allerede en konto med denne email";
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

  try {
    await sendVerificationEmail({ to: user.email, name: user.name, verifyUrl });
  } catch (error) {
    // The account still exists and can request a fresh link from the
    // check-email page, so a delivery failure here shouldn't 500 the signup.
    console.error("Failed to send verification email", error);
  }

  redirect(`/signup/check-email?email=${encodeURIComponent(user.email)}`);
}
