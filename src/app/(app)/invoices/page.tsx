import Link from "next/link";
import { toIntlLocale } from "@/i18n/config";
import { getLocale, getTranslations } from "@/i18n/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export default async function InvoicesPage() {
  const session = await requireSession();
  const [t, locale] = await Promise.all([getTranslations("default"), getLocale()]);
  const intl = toIntlLocale(locale);

  const STATUS_LABELS: Record<string, string> = {
    DRAFT: t("Kladde"),
    SENT: t("Sendt"),
    PAID: t("Betalt"),
    OVERDUE: t("Forfalden"),
  };

  const invoices = await prisma.invoice.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t("Fakturaer")}
        </h1>
        <Link
          href="/invoices/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {t("Ny faktura")}
        </Link>
      </div>

      {invoices.length === 0 ? (
        <p className="text-sm text-zinc-500">{t("Ingen fakturaer endnu.")}</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <Link
                href={`/invoices/${invoice.id}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {invoice.number ? `#${invoice.number}` : t("Kladde")} —{" "}
                    {invoice.client.name}
                  </p>
                  <p className="text-zinc-500">
                    {STATUS_LABELS[invoice.status]}
                  </p>
                </div>
                <span className="text-zinc-500">
                  {Number(invoice.totalAmount).toLocaleString(intl)} kr.
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
