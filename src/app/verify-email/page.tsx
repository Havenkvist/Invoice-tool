import { getTranslations } from "@/i18n/server";
import ConfirmForm from "./confirm-form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const t = await getTranslations("default");

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {token ? (
          <ConfirmForm token={token} />
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("Manglende bekræftelseslink.")}
          </p>
        )}
      </div>
    </div>
  );
}
