import Link from "next/link";
import { toIntlLocale } from "@/i18n/config";
import { getLocale, getTranslations } from "@/i18n/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireSession();
  const organizationId = session.user.organizationId;
  const [t, locale] = await Promise.all([getTranslations("default"), getLocale()]);
  const intl = toIntlLocale(locale);

  const [clientCount, invoiceCount, unpaidInvoices, recentInvoices] =
    await Promise.all([
      prisma.client.count({ where: { organizationId } }),
      prisma.invoice.count({ where: { organizationId } }),
      prisma.invoice.findMany({
        where: { organizationId, status: { in: ["SENT", "OVERDUE"] } },
        select: { totalAmount: true },
      }),
      prisma.invoice.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { client: true },
      }),
    ]);

  const outstandingTotal = unpaidInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.totalAmount),
    0,
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t("Oversigt")}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={t("Kunder")} value={clientCount.toString()} />
        <StatCard label={t("Fakturaer")} value={invoiceCount.toString()} />
        <StatCard
          label={t("Udestående")}
          value={`${outstandingTotal.toLocaleString(intl)} kr.`}
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            {t("Seneste fakturaer")}
          </h2>
          <Link
            href="/invoices"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {t("Se alle")}
          </Link>
        </div>
        {recentInvoices.length === 0 ? (
          <p className="text-sm text-zinc-500">{t("Ingen fakturaer endnu.")}</p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {recentInvoices.map((invoice) => (
              <li key={invoice.id}>
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <span>
                    {invoice.number ? `#${invoice.number}` : t("Kladde")} —{" "}
                    {invoice.client.name}
                  </span>
                  <span className="text-zinc-500">
                    {Number(invoice.totalAmount).toLocaleString(intl)} kr.
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}
