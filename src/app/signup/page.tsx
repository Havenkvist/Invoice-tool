import Link from "next/link";
import LocaleSwitcher from "@/components/locale-switcher";
import { getTranslations } from "@/i18n/server";
import SignupForm from "./signup-form";

export default async function SignupPage() {
  const t = await getTranslations("default");
  return (
    <div className="relative flex flex-1 items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="absolute right-4 top-4">
        <LocaleSwitcher />
      </div>
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t("Opret konto")}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {t("Opret din virksomhed og din bruger.")}
        </p>
        <SignupForm />
        <p className="mt-6 text-sm text-zinc-500">
          {t("Har du allerede en konto?")}{" "}
          <Link href="/login" className="font-medium text-zinc-900 dark:text-zinc-100">
            {t("Log ind")}
          </Link>
        </p>
      </div>
    </div>
  );
}
