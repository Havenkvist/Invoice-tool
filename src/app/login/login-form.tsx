"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useTranslations } from "@/i18n/client";
import { loginAction } from "./actions";

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("Email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("Adgangskode")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {state && (
        <p className="text-sm text-red-600">
          {state.message}
          {state.unverifiedEmail && (
            <>
              {" "}
              <Link
                href={`/signup/check-email?email=${encodeURIComponent(state.unverifiedEmail)}`}
                className="underline"
              >
                {t("Send bekræftelseslink igen")}
              </Link>
            </>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pending ? t("Logger ind…") : t("Log ind")}
      </button>
    </form>
  );
}
