"use client";

import { useActionState } from "react";
import CustomFieldsEditor from "@/components/custom-fields-editor";
import { createTemplateAction } from "./actions";

export default function TemplateForm() {
  const [error, formAction, pending] = useActionState(
    createTemplateAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Navn
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder='F.eks. "Bryllupspakke"'
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <CustomFieldsEditor />
      <p className="-mt-2 text-xs text-zinc-500">
        Disse felter foreslås automatisk, når skabelonen vælges på en ny faktura.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pending ? "Gemmer…" : "Opret skabelon"}
      </button>
    </form>
  );
}
