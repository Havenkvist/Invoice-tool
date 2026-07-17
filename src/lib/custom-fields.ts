/**
 * Shared shape for the flexible "extra fields" on Invoice.customFields and
 * InvoiceTemplate.fields (both stored as JSONB). An ordered array of
 * label/value pairs, e.g. [{ label: "Betalingsbetingelser", value: "Netto 8 dage" }].
 * Never used to generate binding legal/licensing text — see
 * NEVER_GENERATE_LEGAL_TEXT in constants.ts.
 */
export type CustomField = { label: string; value: string };

/** Preset labels offered in the field-type dropdown; "Andet" (Other) lets the user type their own. */
export const CUSTOM_FIELD_PRESET_LABELS = [
  "Betalingsbetingelser",
  "Reference/PO-nummer",
  "Bankoplysninger",
  "Rabat",
  "Leveringsdato",
] as const;

export const CUSTOM_FIELD_CUSTOM_OPTION = "Andet";

/** Safely reads a Prisma JsonValue back into a CustomField[], discarding anything malformed. */
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

/** Builds a CustomField[] from parallel formData.getAll() arrays, dropping blank-label rows. */
export function customFieldsFromFormEntries(
  labels: FormDataEntryValue[],
  values: FormDataEntryValue[],
): CustomField[] {
  return labels
    .map((label, i) => ({ label: String(label).trim(), value: String(values[i] ?? "").trim() }))
    .filter((field) => field.label.length > 0);
}
