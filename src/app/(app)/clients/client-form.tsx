"use client";

import { useActionState } from "react";
import { useTranslations } from "@/i18n/client";
import { createClientAction } from "./actions";

export default function ClientForm() {
  const t = useTranslations();
  const [error, formAction, pending] = useActionState(
    createClientAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <Field label={t("Navn")} name="name" required />
      <Field label={t("Email")} name="email" type="email" required />
      <Field
        label={t("CVR-nummer (valgfri, tom for privatperson)")}
        name="cvrNumber"
      />
      <Field label={t("Adresse")} name="addressLine1" required />
      <Field label={t("Adresse linje 2")} name="addressLine2" />
      <div className="grid grid-cols-2 gap-4">
        <Field label={t("Postnummer")} name="postalCode" required />
        <Field label={t("By")} name="city" required />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pending ? t("Gemmer…") : t("Opret kunde")}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </div>
  );
}
