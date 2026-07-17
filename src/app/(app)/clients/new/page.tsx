import { getTranslations } from "@/i18n/server";
import ClientForm from "../client-form";

export default async function NewClientPage() {
  const t = await getTranslations("default");
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {t("Ny kunde")}
      </h1>
      <ClientForm />
    </div>
  );
}
