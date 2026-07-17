import Link from "next/link";
import LocaleSwitcher from "@/components/locale-switcher";
import { getTranslations } from "@/i18n/server";
import LoginForm from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; verified?: string }>;
}) {
  const { callbackUrl, verified } = await searchParams;
  const t = await getTranslations("default");

  return (
    <div className="relative flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="absolute right-4 top-4">
        <LocaleSwitcher />
      </div>
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t("Log ind")}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {t("Log ind for at tilgå dine fakturaer.")}
        </p>
        {verified === "1" && (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-400">
            {t("Din email er bekræftet. Du kan nu logge ind.")}
          </p>
        )}
        <LoginForm callbackUrl={callbackUrl} />
        <p className="mt-6 text-sm text-zinc-500">
          {t("Har du ikke en konto?")}{" "}
          <Link href="/signup" className="font-medium text-zinc-900 dark:text-zinc-100">
            {t("Opret konto")}
          </Link>
        </p>
      </div>
    </div>
  );
}
