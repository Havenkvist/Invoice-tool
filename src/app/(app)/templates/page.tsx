import Link from "next/link";
import { getTranslations } from "@/i18n/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export default async function TemplatesPage() {
  const session = await requireSession();
  const t = await getTranslations("default");

  const templates = await prisma.invoiceTemplate.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t("Skabeloner")}
        </h1>
        <Link
          href="/templates/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {t("Ny skabelon")}
        </Link>
      </div>

      {templates.length === 0 ? (
        <p className="text-sm text-zinc-500">{t("Ingen skabeloner endnu.")}</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {templates.map((template) => (
            <li key={template.id} className="px-4 py-3 text-sm">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {template.name}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
