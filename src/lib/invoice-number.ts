import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

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
