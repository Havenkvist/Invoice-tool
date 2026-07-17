import daDefault from "./locales/da/default.json";
import daErrors from "./locales/da/errors.json";
import daEmail from "./locales/da/email.json";
import daPdf from "./locales/da/pdf.json";
import enDefault from "./locales/en/default.json";
import enErrors from "./locales/en/errors.json";
import enEmail from "./locales/en/email.json";
import enPdf from "./locales/en/pdf.json";
import type { Locale } from "./config";

export const DOMAINS = ["default", "errors", "email", "pdf"] as const;
export type Domain = (typeof DOMAINS)[number];

type Dictionary = Record<string, string>;

const DICTIONARIES: Record<Locale, Record<Domain, Dictionary>> = {
  da: { default: daDefault, errors: daErrors, email: daEmail, pdf: daPdf },
  en: { default: enDefault, errors: enErrors, email: enEmail, pdf: enPdf },
};

export function getDictionary(locale: Locale, domain: Domain): Dictionary {
  return DICTIONARIES[locale][domain];
}

export function translate(
  locale: Locale,
  domain: Domain,
  key: string,
  params?: Record<string, string | number>,
): string {
  const template = DICTIONARIES[locale]?.[domain]?.[key] ?? key;
  if (!params) return template;
  return template.replace(/%\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}
