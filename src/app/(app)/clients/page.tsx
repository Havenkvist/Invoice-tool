import Link from "next/link";
import { getTranslations } from "@/i18n/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export default async function ClientsPage() {
  const session = await requireSession();
  const t = await getTranslations("default");

  const clients = await prisma.client.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t("Kunder")}
        </h1>
        <Link
          href="/clients/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {t("Ny kunde")}
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-sm text-zinc-500">{t("Ingen kunder endnu.")}</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {clients.map((client) => (
            <li
              key={client.id}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {client.name}
                </p>
                <p className="text-zinc-500">{client.email}</p>
              </div>
              <div className="text-right text-zinc-500">
                <p>
                  {client.cvrNumber
                    ? t("CVR %{number}", { number: client.cvrNumber })
                    : t("Privat")}
                </p>
                <p>
                  {client.city}, {client.postalCode}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
