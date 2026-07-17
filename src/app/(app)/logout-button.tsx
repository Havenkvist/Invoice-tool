"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "@/i18n/client";

export default function LogoutButton() {
  const t = useTranslations();
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/login" })}
      className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
    >
      {t("Log ud")}
    </button>
  );
}
