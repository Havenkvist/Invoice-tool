"use server";

import { AuthError } from "next-auth";
import { EmailNotVerifiedError, signIn } from "@/auth";
import { getTranslations } from "@/i18n/server";

export type LoginState = {
  message: string;
  unverifiedEmail?: string;
} | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrl = formData.get("callbackUrl");
  const t = await getTranslations("errors");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: typeof callbackUrl === "string" && callbackUrl ? callbackUrl : "/dashboard",
    });
  } catch (error) {
    if (error instanceof EmailNotVerifiedError) {
      return {
        message: t("Bekræft din email, før du kan logge ind."),
        unverifiedEmail: typeof email === "string" ? email : undefined,
      };
    }
    if (error instanceof AuthError) {
      return { message: t("Forkert email eller adgangskode.") };
    }
    throw error;
  }
}
