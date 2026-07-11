import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Atomically assigns the next sequential invoice number for an organization
 * and returns it. Danish law requires invoice numbers to be sequential per
 * business with zero gaps, so:
 *
 * - Numbers are stored on Organization.nextInvoiceNumber, never derived from
 *   a global auto-increment id or from counting existing invoices (deletes
 *   would create gaps or reuse numbers).
 * - Numbers are only consumed here, at the moment an invoice is actually
 *   issued (draft -> sent), not when a draft is created — so abandoned
 *   drafts never burn a number.
 * - The increment happens via a single UPDATE, which takes a row lock on
 *   the Organization row in Postgres. Concurrent callers serialize on that
 *   lock, so two invoices can never be assigned the same number.
 *
 * Must be called from inside a transaction that also persists the invoice
 * with this number, so a failure after this point can't leave the counter
 * incremented without a corresponding invoice.
 */
export async function assignNextInvoiceNumber(
  tx: Prisma.TransactionClient,
  organizationId: string,
): Promise<number> {
  const organization = await tx.organization.update({
    where: { id: organizationId },
    data: { nextInvoiceNumber: { increment: 1 } },
    select: { nextInvoiceNumber: true },
  });

  return organization.nextInvoiceNumber - 1;
}

/**
 * Issues a draft invoice: assigns it a sequential number and marks it SENT.
 * Throws if the invoice is not currently a DRAFT (a number must never be
 * reassigned once issued).
 */
export async function issueInvoice(invoiceId: string) {
  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUniqueOrThrow({
      where: { id: invoiceId },
      select: { id: true, organizationId: true, status: true },
    });

    if (invoice.status !== "DRAFT") {
      throw new Error(
        `Invoice ${invoiceId} is not a draft (status: ${invoice.status}); cannot re-issue.`,
      );
    }

    const number = await assignNextInvoiceNumber(tx, invoice.organizationId);

    return tx.invoice.update({
      where: { id: invoiceId },
      data: { number, status: "SENT" },
    });
  });
}
