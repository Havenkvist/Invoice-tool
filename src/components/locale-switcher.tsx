"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/config";
import { setLocaleAction } from "@/i18n/actions";
import { useLocale } from "@/i18n/client";

const LOCALE_LABELS: Record<Locale, string> = {
  da: "DA",
  en: "EN",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          disabled={isPending}
          aria-current={locale === code}
          className={
            locale === code
              ? "rounded px-1.5 py-0.5 font-medium text-zinc-900 dark:text-zinc-50"
              : "rounded px-1.5 py-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-60 dark:text-zinc-600 dark:hover:text-zinc-300"
          }
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
