export type CustomField = { label: string; value: string };
export const CUSTOM_FIELD_PRESET_LABELS = [
  "Betalingsbetingelser",
  "Reference/PO-nummer",
  "Bankoplysninger",
  "Rabat",
  "Leveringsdato",
] as const;

export const CUSTOM_FIELD_CUSTOM_OPTION = "Andet";
export function parseCustomFields(value: unknown): CustomField[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
    .map((entry) => ({
      label: typeof entry.label === "string" ? entry.label : "",
      value: typeof entry.value === "string" ? entry.value : "",
    }))
    .filter((field) => field.label.trim().length > 0);
}

export function customFieldsFromFormEntries(
  labels: FormDataEntryValue[],
  values: FormDataEntryValue[],
): CustomField[] {
  return labels
    .map((label, i) => ({ label: String(label).trim(), value: String(values[i] ?? "").trim() }))
    .filter((field) => field.label.length > 0);
}
