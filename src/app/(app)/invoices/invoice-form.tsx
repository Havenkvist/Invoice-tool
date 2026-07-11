"use client";

import { useActionState, useState } from "react";
import { createInvoiceAction } from "./actions";

type LineItemRow = { key: number; description: string; quantity: string; unitPrice: string };

let nextKey = 0;
function emptyRow(): LineItemRow {
  return { key: nextKey++, description: "", quantity: "1", unitPrice: "0" };
}

export default function InvoiceForm({
  clients,
  templates,
  defaultVatRate,
  defaultIssueDate,
  defaultDueDate,
}: {
  clients: { id: string; name: string }[];
  templates: { id: string; name: string }[];
  defaultVatRate: number;
  defaultIssueDate: string;
  defaultDueDate: string;
}) {
  const [error, formAction, pending] = useActionState(
    createInvoiceAction,
    undefined,
  );
  const [rows, setRows] = useState<LineItemRow[]>([emptyRow()]);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="clientId" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Kunde
          </label>
          <select
            id="clientId"
            name="clientId"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="templateId" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Skabelon (valgfri)
          </label>
          <select
            id="templateId"
            name="templateId"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">Ingen</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="issueDate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Fakturadato
          </label>
          <input
            id="issueDate"
            name="issueDate"
            type="date"
            defaultValue={defaultIssueDate}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="dueDate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Forfaldsdato
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={defaultDueDate}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="vatRate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Momssats
          </label>
          <input
            id="vatRate"
            name="vatRate"
            type="number"
            step="0.0001"
            min="0"
            max="1"
            defaultValue={defaultVatRate}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Linjer
        </p>
        <div className="flex flex-col gap-2">
          {rows.map((row, index) => (
            <div key={row.key} className="grid grid-cols-[1fr_5rem_7rem_2rem] gap-2">
              <input
                name="description"
                placeholder="Beskrivelse"
                defaultValue={row.description}
                required
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                name="quantity"
                type="number"
                step="0.01"
                placeholder="Antal"
                defaultValue={row.quantity}
                required
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                name="unitPrice"
                type="number"
                step="0.01"
                placeholder="Pris"
                defaultValue={row.unitPrice}
                required
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((_, i) => i !== index))}
                disabled={rows.length === 1}
                className="text-sm text-zinc-400 hover:text-red-600 disabled:opacity-30"
                aria-label="Fjern linje"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRows((r) => [...r, emptyRow()])}
          className="w-fit text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          + Tilføj linje
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pending ? "Gemmer…" : "Opret kladde"}
      </button>
    </form>
  );
}
