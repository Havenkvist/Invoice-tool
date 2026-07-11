"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { calculateInvoiceTotals } from "@/lib/invoice-calc";
import { issueInvoice } from "@/lib/invoice-number";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().nonnegative(),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1, "Vælg en kunde"),
  templateId: z.string().optional(),
  issueDate: z.string().min(1, "Fakturadato er påkrævet"),
  dueDate: z.string().min(1, "Forfaldsdato er påkrævet"),
  vatRate: z.coerce.number().min(0).max(1),
});

export async function createInvoiceAction(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const session = await requireSession();

  const parsed = invoiceSchema.safeParse({
    clientId: formData.get("clientId"),
    templateId: formData.get("templateId") || undefined,
    issueDate: formData.get("issueDate"),
    dueDate: formData.get("dueDate"),
    vatRate: formData.get("vatRate"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Ugyldige oplysninger";
  }

  const descriptions = formData.getAll("description");
  const quantities = formData.getAll("quantity");
  const unitPrices = formData.getAll("unitPrice");

  const lineItems = descriptions
    .map((description, i) => ({
      description,
      quantity: quantities[i],
      unitPrice: unitPrices[i],
    }))
    .map((raw) => lineItemSchema.safeParse(raw))
    .filter((result) => result.success)
    .map((result) => result.data);

  if (lineItems.length === 0) {
    return "Tilføj mindst én linje";
  }

  const client = await prisma.client.findFirst({
    where: { id: parsed.data.clientId, organizationId: session.user.organizationId },
  });
  if (!client) {
    return "Ugyldig kunde";
  }

  const totals = calculateInvoiceTotals(lineItems, parsed.data.vatRate);

  const invoice = await prisma.invoice.create({
    data: {
      organizationId: session.user.organizationId,
      clientId: parsed.data.clientId,
      templateId: parsed.data.templateId || null,
      issueDate: new Date(parsed.data.issueDate),
      dueDate: new Date(parsed.data.dueDate),
      vatRate: parsed.data.vatRate,
      subtotalAmount: totals.subtotalAmount,
      vatAmount: totals.vatAmount,
      totalAmount: totals.totalAmount,
      lineItems: {
        create: lineItems.map((item, position) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          position,
        })),
      },
    },
  });

  revalidatePath("/invoices");
  redirect(`/invoices/${invoice.id}`);
}

export async function issueInvoiceAction(invoiceId: string) {
  const session = await requireSession();

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, organizationId: session.user.organizationId },
  });
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  await issueInvoice(invoiceId);

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
}
