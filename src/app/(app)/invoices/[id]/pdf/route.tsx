import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { InvoicePdfDocument, type InvoicePdfData } from "@/components/invoice-pdf";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await requireSession();

  const invoice = await prisma.invoice.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      client: true,
      organization: true,
      lineItems: { orderBy: { position: "asc" } },
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: InvoicePdfData = {
    number: invoice.number,
    issueDate: invoice.issueDate.toLocaleDateString("da-DK"),
    dueDate: invoice.dueDate.toLocaleDateString("da-DK"),
    vatRate: Number(invoice.vatRate),
    subtotalAmount: Number(invoice.subtotalAmount),
    vatAmount: Number(invoice.vatAmount),
    totalAmount: Number(invoice.totalAmount),
    currency: invoice.currency,
    organization: {
      name: invoice.organization.name,
      cvrNumber: invoice.organization.cvrNumber,
      addressLine1: invoice.organization.addressLine1,
      addressLine2: invoice.organization.addressLine2,
      postalCode: invoice.organization.postalCode,
      city: invoice.organization.city,
      country: invoice.organization.country,
    },
    client: {
      name: invoice.client.name,
      cvrNumber: invoice.client.cvrNumber,
      addressLine1: invoice.client.addressLine1,
      addressLine2: invoice.client.addressLine2,
      postalCode: invoice.client.postalCode,
      city: invoice.client.city,
      country: invoice.client.country,
    },
    lineItems: invoice.lineItems.map((item) => ({
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
    })),
  };

  const buffer = await renderToBuffer(<InvoicePdfDocument invoice={data} />);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="faktura-${invoice.number ?? invoice.id}.pdf"`,
    },
  });
}
