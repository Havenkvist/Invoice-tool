import { DANISH_STANDARD_VAT_RATE } from "@/lib/constants";
import { defaultInvoiceDates } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import InvoiceForm from "../invoice-form";

export default async function NewInvoicePage() {
  const session = await requireSession();
  const { issueDate, dueDate } = defaultInvoiceDates();

  const [clients, templates] = await Promise.all([
    prisma.client.findMany({
      where: { organizationId: session.user.organizationId },
      orderBy: { name: "asc" },
    }),
    prisma.invoiceTemplate.findMany({
      where: { organizationId: session.user.organizationId },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Ny faktura
      </h1>
      {clients.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Opret en kunde, før du kan oprette en faktura.
        </p>
      ) : (
        <InvoiceForm
          clients={clients.map((c) => ({ id: c.id, name: c.name }))}
          templates={templates.map((t) => ({ id: t.id, name: t.name }))}
          defaultVatRate={DANISH_STANDARD_VAT_RATE}
          defaultIssueDate={issueDate}
          defaultDueDate={dueDate}
        />
      )}
    </div>
  );
}
