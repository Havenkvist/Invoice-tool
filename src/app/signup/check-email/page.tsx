import { getTranslations } from "@/i18n/server";
import ResendForm from "./resend-form";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const t = await getTranslations("default");

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t("Tjek din email")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t("Vi har sendt et bekræftelseslink til")}{" "}
          {email ? <strong>{email}</strong> : t("din email")}.{" "}
          {t("Klik på linket for at aktivere din konto, før du kan logge ind.")}
        </p>
        <ResendForm defaultEmail={email} />
      </div>
    </div>
  );
}
