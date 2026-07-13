"use server";

import { redirect } from "next/navigation";
import { consumeVerificationToken } from "@/lib/verification-token";

export async function confirmEmailAction(
  _prevState: "invalid" | "expired" | undefined,
  formData: FormData,
): Promise<"invalid" | "expired" | undefined> {
  const token = formData.get("token");
  if (typeof token !== "string" || !token) {
    return "invalid";
  }

  const result = await consumeVerificationToken(token);
  if (!result.ok) {
    return result.reason;
  }

  redirect("/login?verified=1");
}
