"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useTranslations } from "@/i18n/client";
import { confirmEmailAction } from "./actions";

export default function ConfirmForm({ token }: { token: string }) {
  const t = useTranslations();
  const [result, formAction, pending] = useActionState(
    confirmEmailAction,
    undefined,
  );

  if (result === "invalid" || result === "expired") {
    return (
      <>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {t("Linket virker ikke")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {result === "expired"
            ? t("Linket er udløbet. Du kan anmode om et nyt.")
            : t("Linket er ugyldigt eller allerede brugt.")}
        </p>
        <Link
          href="/signup/check-email"
          className="mt-6 inline-block rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          {t("Send nyt link")}
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {t("Bekræft din email")}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t("Klik nedenfor for at aktivere din konto.")}
      </p>
      <form action={formAction} className="mt-6">
        <input type="hidden" name="token" value={token} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {pending ? t("Bekræfter…") : t("Bekræft email")}
        </button>
      </form>
    </>
  );
}
