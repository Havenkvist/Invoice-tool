import Link from "next/link";
import LocaleSwitcher from "@/components/locale-switcher";
import { getTranslations } from "@/i18n/server";
import { requireSession } from "@/lib/session";
import LogoutButton from "./logout-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const t = await getTranslations("default");

  const NAV_LINKS = [
    { href: "/dashboard", label: t("Oversigt") },
    { href: "/clients", label: t("Kunder") },
    { href: "/templates", label: t("Skabeloner") },
    { href: "/invoices", label: t("Fakturaer") },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Faktura
            </span>
            <nav className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <span className="text-sm text-zinc-500">{session.user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
