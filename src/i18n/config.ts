export const SUPPORTED_LOCALES = ["da", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "da";
export const LOCALE_COOKIE_NAME = "locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function toIntlLocale(locale: Locale): string {
  return locale === "en" ? "en-US" : "da-DK";
}
