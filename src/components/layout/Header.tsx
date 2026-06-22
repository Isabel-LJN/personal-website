"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { localizedPath } from "@/i18n/config";
import { useLocale } from "@/i18n/locale-context";
import { LanguageSwitch } from "./LanguageSwitch";

export function Header() {
  const { locale, dict } = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md">
      <div className="editorial-container flex h-14 items-center justify-between gap-4 sm:h-16">
        <Link
          href={localizedPath(locale, "/")}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="relative h-8 w-8 overflow-hidden rounded-full border border-[var(--color-border)] bg-white">
            <Image
              src="/logo.png"
              alt={dict.meta.siteName}
              fill
              className="object-cover"
              sizes="32px"
              priority
            />
          </span>
          <span className="hidden text-sm font-semibold text-black sm:inline">
            {dict.meta.siteName}
          </span>
        </Link>

        <div className="aw-search min-w-0 flex-1 max-w-md">
          <span className="text-base opacity-40">⌕</span>
          <span className="truncate">{dict.common.searchPlaceholder}</span>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <Suspense fallback={null}>
            <LanguageSwitch />
          </Suspense>
          <Link
            href={localizedPath(locale, "/contact")}
            className="hidden rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-xs font-medium text-black transition-colors hover:bg-black hover:text-white sm:inline-block"
          >
            {dict.common.getInTouch}
          </Link>
        </div>
      </div>
    </header>
  );
}
