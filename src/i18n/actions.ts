"use server";

import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE_NAME, type Locale } from "./config";

export async function setLocaleAction(locale: Locale) {
  if (!isLocale(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
