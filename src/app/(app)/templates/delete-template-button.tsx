"use client";

import { useTranslations } from "@/i18n/client";
import { deleteTemplateAction } from "./actions";

export default function DeleteTemplateButton({ templateId }: { templateId: string }) {
  const t = useTranslations();

  return (
    <form action={deleteTemplateAction.bind(null, templateId)}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(t("Er du sikker på, at du vil slette denne skabelon?"))) {
            e.preventDefault();
          }
        }}
        className="rounded-md px-2 py-1 text-xs font-medium text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
      >
        {t("Slet")}
      </button>
    </form>
  );
}
