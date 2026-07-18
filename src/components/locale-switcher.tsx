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
    <div className="inline-flex items-center gap-0.5 rounded-full bg-zinc-100 p-0.5 text-sm dark:bg-zinc-800">
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          disabled={isPending}
          aria-pressed={locale === code}
          className={
            locale === code
              ? "rounded-full bg-white px-2.5 py-1 font-medium text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
              : "rounded-full px-2.5 py-1 text-zinc-500 hover:text-zinc-700 disabled:opacity-60 dark:text-zinc-400 dark:hover:text-zinc-200"
          }
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
