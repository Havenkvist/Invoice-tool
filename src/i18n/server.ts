import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE_NAME, type Locale } from "./config";
import { translate, type Domain } from "./dictionaries";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language");
  if (acceptLanguage?.toLowerCase().startsWith("en")) return "en";

  return DEFAULT_LOCALE;
}

export async function getTranslations(domain: Domain, localeOverride?: Locale) {
  const locale = localeOverride ?? (await getLocale());
  return (key: string, params?: Record<string, string | number>) =>
    translate(locale, domain, key, params);
}
