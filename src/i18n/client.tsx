"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import { translate, type Domain } from "./dictionaries";

const LocaleContext = createContext<Locale | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  const locale = useContext(LocaleContext);
  if (!locale) throw new Error("useLocale must be used within I18nProvider");
  return locale;
}

export function useTranslations(domain: Domain = "default") {
  const locale = useLocale();
  return useMemo(
    () =>
      (key: string, params?: Record<string, string | number>) =>
        translate(locale, domain, key, params),
    [locale, domain],
  );
}
