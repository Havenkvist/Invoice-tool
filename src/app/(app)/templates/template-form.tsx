"use client";

import { useActionState } from "react";
import CustomFieldsEditor from "@/components/custom-fields-editor";
import { useTranslations } from "@/i18n/client";
import type { CustomField } from "@/lib/custom-fields";
import { createTemplateAction, deleteTemplateAction, updateTemplateAction } from "./actions";

type Template = {
  id: string;
  name: string;
  fields: CustomField[];
};

export default function TemplateForm({ template }: { template?: Template }) {
  const t = useTranslations();
  const action = template ? updateTemplateAction.bind(null, template.id) : createTemplateAction;
  const [error, formAction, pending] = useActionState(action, undefined);

  return (
    <div className="flex max-w-lg flex-col gap-4">
      <form id="template-form" action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("Navn")}
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={template?.name}
            placeholder={t('F.eks. "Bryllupspakke"')}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <CustomFieldsEditor initialFields={template?.fields} />
        <p className="-mt-2 text-xs text-zinc-500">
          {t("Disse felter foreslås automatisk, når skabelonen vælges på en ny faktura.")}
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="mt-2 flex items-center justify-between">
        <button
          type="submit"
          form="template-form"
          disabled={pending}
          className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {pending
            ? t("Gemmer…")
            : template
              ? t("Gem ændringer")
              : t("Opret skabelon")}
        </button>

        {template && (
          <form action={deleteTemplateAction.bind(null, template.id)}>
            <button
              type="submit"
              onClick={(e) => {
                if (!confirm(t("Er du sikker på, at du vil slette denne skabelon?"))) {
                  e.preventDefault();
                }
              }}
              className="w-fit rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              {t("Slet skabelon")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
