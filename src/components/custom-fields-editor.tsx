"use client";

import { useState } from "react";
import {
  CUSTOM_FIELD_CUSTOM_OPTION,
  CUSTOM_FIELD_PRESET_LABELS,
  type CustomField,
} from "@/lib/custom-fields";

type FieldRow = { key: number; preset: string; customLabel: string; value: string };

let nextKey = 0;

function rowFromField(field: CustomField): FieldRow {
  const isPreset = (CUSTOM_FIELD_PRESET_LABELS as readonly string[]).includes(field.label);
  return {
    key: nextKey++,
    preset: isPreset ? field.label : CUSTOM_FIELD_CUSTOM_OPTION,
    customLabel: isPreset ? "" : field.label,
    value: field.value,
  };
}

/**
 * Repeatable label/value rows for Invoice.customFields and InvoiceTemplate.fields.
 * Submits as parallel "customFieldLabel"/"customFieldValue" form entries (same
 * pattern as the line-item rows) — read them back with customFieldsFromFormEntries.
 */
export default function CustomFieldsEditor({ initialFields = [] }: { initialFields?: CustomField[] }) {
  const [rows, setRows] = useState<FieldRow[]>(() => initialFields.map(rowFromField));

  function updateRow(key: number, patch: Partial<FieldRow>) {
    setRows((r) => r.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Andre felter (valgfri)
      </p>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.key} className="flex items-start gap-2">
            <select
              value={row.preset}
              onChange={(e) => updateRow(row.key, { preset: e.target.value })}
              className="w-48 shrink-0 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            >
              {CUSTOM_FIELD_PRESET_LABELS.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
              <option value={CUSTOM_FIELD_CUSTOM_OPTION}>{CUSTOM_FIELD_CUSTOM_OPTION}</option>
            </select>

            {row.preset === CUSTOM_FIELD_CUSTOM_OPTION && (
              <input
                placeholder="Feltnavn"
                value={row.customLabel}
                onChange={(e) => updateRow(row.key, { customLabel: e.target.value })}
                className="w-40 shrink-0 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              />
            )}

            <input
              type="hidden"
              name="customFieldLabel"
              value={row.preset === CUSTOM_FIELD_CUSTOM_OPTION ? row.customLabel : row.preset}
            />

            <input
              name="customFieldValue"
              placeholder="Værdi"
              value={row.value}
              onChange={(e) => updateRow(row.key, { value: e.target.value })}
              className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            />

            <button
              type="button"
              onClick={() => setRows((r) => r.filter((x) => x.key !== row.key))}
              className="px-2 py-2 text-sm text-zinc-400 hover:text-red-600"
              aria-label="Fjern felt"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          setRows((r) => [
            ...r,
            { key: nextKey++, preset: CUSTOM_FIELD_PRESET_LABELS[0], customLabel: "", value: "" },
          ])
        }
        className="w-fit text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        + Tilføj felt
      </button>
    </div>
  );
}
