"use client";

import { useActionState } from "react";
import { useTranslations } from "@/i18n/client";
import { signupAction } from "./actions";

export default function SignupForm() {
  const t = useTranslations();
  const [error, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("Virksomhed")}
        </legend>
        <Field label={t("Virksomhedsnavn")} name="organizationName" required />
        <Field label={t("CVR-nummer")} name="cvrNumber" required placeholder="12345678" />
        <Field label={t("Adresse")} name="addressLine1" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("Postnummer")} name="postalCode" required />
          <Field label={t("By")} name="city" required />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("Din bruger")}
        </legend>
        <Field label={t("Navn")} name="name" required />
        <Field label={t("Email")} name="email" type="email" required />
        <Field
          label={t("Adgangskode")}
          name="password"
          type="password"
          required
          autoComplete="new-password"
        />
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pending ? t("Opretter…") : t("Opret konto")}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </div>
  );
}
