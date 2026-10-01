"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n/strings";

const tabs = [
  { href: "/meditations", label: t("nav.meditation") },
  { href: "/brain-dump", label: t("nav.brainDump") },
  { href: "/cards", label: t("nav.cards") },
  { href: "/journal", label: t("nav.journal") },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/login")) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-sand/60 bg-cream/95 backdrop-blur
        supports-[backdrop-filter]:bg-cream/85 dark:border-ink/60 dark:bg-ink/95"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-1">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 items-center justify-center whitespace-nowrap px-1 py-3.5 text-xs transition-colors duration-300 ${
                active ? "font-medium text-moss dark:text-sand" : "text-ink/50 dark:text-cream/50"
              }`}
            >
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
