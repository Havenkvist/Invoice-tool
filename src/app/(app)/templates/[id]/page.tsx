import { notFound } from "next/navigation";
import { getTranslations } from "@/i18n/server";
import { parseCustomFields } from "@/lib/custom-fields";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import TemplateForm from "../template-form";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  const t = await getTranslations("default");

  const template = await prisma.invoiceTemplate.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!template) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {t("Rediger skabelon")}
      </h1>
      <TemplateForm
        template={{
          id: template.id,
          name: template.name,
          fields: parseCustomFields(template.fields),
        }}
      />
    </div>
  );
}
