/**
 * Danish invoicing legal/domain constants.
 *
 * These encode legal minimums and caps that change over time via statute or
 * Nationalbanken rate changes. Every value here should be periodically
 * reverified against current Danish law (primarily Rentelovens rules on
 * rykkergebyr/morarente and Bogføringsloven/Momsloven for invoice content).
 * Last reviewed: 2026-07-11 (not a legal source — verify before relying on it).
 */

// ---------------------------------------------------------------------------
// Invoice content — legal minimums (Bogføringsloven / Momsbekendtgørelsen)
// ---------------------------------------------------------------------------

/**
 * Fields a Danish invoice is legally required to include. These map to
 * required, validated columns in the Prisma schema (never JSONB):
 * - Issuer CVR number            -> Organization.cvrNumber
 * - Sequential invoice number    -> Invoice.number (gapless per Organization)
 * - Issue date                   -> Invoice.issueDate
 * - VAT rate and VAT amount      -> Invoice.vatRate / Invoice.vatAmount
 */
export const LEGAL_MINIMUM_INVOICE_FIELDS = [
  "issuerCvrNumber",
  "sequentialInvoiceNumber",
  "issueDate",
  "vatRate",
  "vatAmount",
] as const;

/** Standard Danish VAT (moms) rate: 25%. */
export const DANISH_STANDARD_VAT_RATE = 0.25;

// ---------------------------------------------------------------------------
// Rykker (payment reminder) legal caps — Renteloven
// ---------------------------------------------------------------------------
// These are CURRENT LEGAL MAXIMUMS/MINIMUMS as of the last-reviewed date
// above and MUST be periodically reverified — they are set by statute and
// by Nationalbanken's official lending rate, both of which can change.

/** Maximum fee (DKK) that may be charged per individual payment reminder. */
export const RYKKER_MAX_FEE_DKK = 100;

/** Maximum number of reminders that may be sent for a single invoice. */
export const RYKKER_MAX_REMINDERS_PER_INVOICE = 3;

/** Minimum number of days that must elapse between consecutive reminders. */
export const RYKKER_MIN_DAYS_BETWEEN_REMINDERS = 10;

/**
 * Default statutory interest (morarente) on overdue payments: Nationalbanken's
 * official lending rate plus this many percentage points. The Nationalbanken
 * rate itself is NOT hardcoded here — it must be looked up/configured
 * separately since it changes independently of this constant.
 */
export const MORARENTE_PERCENTAGE_POINTS_ABOVE_NATIONALBANKEN_RATE = 8;

/**
 * One-time compensation fee (DKK) that may be charged on B2B (business-to-
 * business) claims under the Danish Interest Act's implementation of the EU
 * Late Payment Directive. Not applicable to B2C (consumer) invoices.
 */
export const B2B_COMPENSATION_FEE_DKK = 310;

// ---------------------------------------------------------------------------
// Account signup
// ---------------------------------------------------------------------------

/** How long an emailed account-verification link stays valid before expiring. */
export const EMAIL_VERIFICATION_TOKEN_TTL_HOURS = 24;

// ---------------------------------------------------------------------------
// Product guardrails
// ---------------------------------------------------------------------------

/**
 * This app must never auto-generate binding legal or licensing text.
 * InvoiceTemplate.fields / Invoice.customFields may only affect invoice
 * CONTENT LAYOUT AND PRESENTATION (line items, notes, branding) — never
 * generate contract clauses, licensing terms, or other legally binding
 * language on a user's behalf.
 */
export const NEVER_GENERATE_LEGAL_TEXT = true;
