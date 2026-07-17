
export const LEGAL_MINIMUM_INVOICE_FIELDS = [
  "issuerCvrNumber",
  "sequentialInvoiceNumber",
  "issueDate",
  "vatRate",
  "vatAmount",
] as const;

export const DANISH_STANDARD_VAT_RATE = 0.25;
export const RYKKER_MAX_FEE_DKK = 100;
export const RYKKER_MAX_REMINDERS_PER_INVOICE = 3;
export const RYKKER_MIN_DAYS_BETWEEN_REMINDERS = 10;
export const MORARENTE_PERCENTAGE_POINTS_ABOVE_NATIONALBANKEN_RATE = 8;
export const B2B_COMPENSATION_FEE_DKK = 310;
export const EMAIL_VERIFICATION_TOKEN_TTL_HOURS = 24;
export const NEVER_GENERATE_LEGAL_TEXT = true;
