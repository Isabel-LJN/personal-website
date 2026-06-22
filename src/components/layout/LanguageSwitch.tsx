"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { localizedPath, stripLocale, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/locale-context";

const localeOptions: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
];

export function LanguageSwitch({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale: currentLocale } = useLocale();
  const { path } = stripLocale(pathname);
  const query = searchParams.toString();

  function hrefFor(code: Locale) {
    const base = localizedPath(code, path);
    return query ? `${base}?${query}` : base;
  }

  return (
    <div className={cn("flex items-center gap-2 text-xs", className)} role="group">
      {localeOptions.map(({ code, label }) => {
        const active = currentLocale === code;
        return (
          <Link
            key={code}
            href={hrefFor(code)}
            className={cn(
              "font-medium transition-colors",
              active ? "text-black" : "text-[var(--color-text-dim)] hover:text-black"
            )}
            aria-current={active ? "true" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
