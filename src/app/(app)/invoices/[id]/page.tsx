import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { issueInvoiceAction } from "../actions";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Kladde",
  SENT: "Sendt",
  PAID: "Betalt",
  OVERDUE: "Forfalden",
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();

  const invoice = await prisma.invoice.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: { client: true, lineItems: { orderBy: { position: "asc" } } },
  });

  if (!invoice) notFound();

  const issue = issueInvoiceAction.bind(null, invoice.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {invoice.number ? `Faktura #${invoice.number}` : "Kladde"}
          </h1>
          <p className="text-sm text-zinc-500">
            {STATUS_LABELS[invoice.status]} — {invoice.client.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {invoice.status === "DRAFT" && (
            <form action={issue}>
              <button
                type="submit"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
              >
                Send faktura
              </button>
            </form>
          )}
          {invoice.number && (
            <Link
              href={`/invoices/${invoice.id}/pdf`}
              target="_blank"
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Download PDF
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
              <th className="px-4 py-2 font-medium">Beskrivelse</th>
              <th className="px-4 py-2 font-medium">Antal</th>
              <th className="px-4 py-2 font-medium">Pris</th>
              <th className="px-4 py-2 text-right font-medium">I alt</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2">{Number(item.quantity)}</td>
                <td className="px-4 py-2">
                  {Number(item.unitPrice).toLocaleString("da-DK")} kr.
                </td>
                <td className="px-4 py-2 text-right">
                  {(Number(item.quantity) * Number(item.unitPrice)).toLocaleString(
                    "da-DK",
                  )}{" "}
                  kr.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col items-end gap-1 px-4 py-3 text-sm">
          <p className="text-zinc-500">
            Subtotal: {Number(invoice.subtotalAmount).toLocaleString("da-DK")} kr.
          </p>
          <p className="text-zinc-500">
            Moms ({(Number(invoice.vatRate) * 100).toFixed(0)}%):{" "}
            {Number(invoice.vatAmount).toLocaleString("da-DK")} kr.
          </p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">
            Total: {Number(invoice.totalAmount).toLocaleString("da-DK")} kr.
          </p>
        </div>
      </div>
    </div>
  );
}
