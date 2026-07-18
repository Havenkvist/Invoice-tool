"use client";

import { THEMES, type Theme } from "@/theme/config";
import { useTheme } from "@/theme/client";
import { useTranslations } from "@/i18n/client";

const THEME_LABELS: Record<Theme, string> = {
  light: "Lys",
  dark: "Mørk",
  system: "System",
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations();

  return (
    <div className="flex items-center gap-1 text-sm">
      {THEMES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setTheme(option)}
          aria-current={theme === option}
          className={
            theme === option
              ? "rounded px-1.5 py-0.5 font-medium text-zinc-900 dark:text-zinc-50"
              : "rounded px-1.5 py-0.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300"
          }
        >
          {t(THEME_LABELS[option])}
        </button>
      ))}
    </div>
  );
}
