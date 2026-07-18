"use client";

import { useTheme } from "@/theme/client";
import { useTranslations } from "@/i18n/client";

const OPTIONS = ["light", "dark"] as const;

const THEME_LABELS: Record<(typeof OPTIONS)[number], string> = {
  light: "Lys",
  dark: "Mørk",
};

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations();

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full bg-zinc-100 p-0.5 text-sm dark:bg-zinc-800">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setTheme(option)}
          aria-pressed={resolvedTheme === option}
          className={
            resolvedTheme === option
              ? "rounded-full bg-white px-2.5 py-1 font-medium text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
              : "rounded-full px-2.5 py-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }
        >
          {t(THEME_LABELS[option])}
        </button>
      ))}
    </div>
  );
}
