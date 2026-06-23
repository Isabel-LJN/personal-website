"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { localizedPath, stripLocale } from "@/i18n/config";
import { useLocale } from "@/i18n/locale-context";

function isActive(path: string, href: string): boolean {
  if (href === "/") return path === "/";
  if (href === "/blog") return path === "/blog" || path.startsWith("/blog/");
  if (href === "/works") return path === "/works" || path.startsWith("/works/");
  return path === href || path.startsWith(`${href}/`);
}

export function BottomDock() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, dict } = useLocale();
  const { path } = stripLocale(pathname);
  const reduce = useReducedMotion();

  const tabs = [
    ...dict.nav,
    { label: dict.common.work, href: "/works" as const },
  ];

  useEffect(() => {
    const routes = [
      localizedPath(locale, "/"),
      localizedPath(locale, "/about"),
      `${localizedPath(locale, "/blog")}?category=cs`,
      localizedPath(locale, "/works"),
      localizedPath(locale, "/contact"),
    ];
    routes.forEach((href) => router.prefetch(href));
  }, [locale, router]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6">
      <motion.nav
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex max-w-full items-center gap-1 rounded-full bg-[var(--color-dock)] px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.28)] sm:gap-2 sm:px-3"
        aria-label="Main navigation"
      >
        <Link
          href={localizedPath(locale, "/")}
          prefetch
          className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 transition-colors hover:bg-white/20 sm:h-11 sm:w-11"
          aria-label={dict.meta.siteName}
        >
          <Image
            src="/logo.png"
            alt=""
            fill
            className="object-cover"
            sizes="44px"
          />
        </Link>

        <div className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />

        <div className="flex items-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-1 [&::-webkit-scrollbar]:hidden">
          {tabs.map((item) => {
            const href =
              item.href === "/blog"
                ? `${localizedPath(locale, "/blog")}?category=cs`
                : localizedPath(locale, item.href);
            const active = isActive(path, item.href);

            return (
              <Link
                key={item.href}
                href={href}
                prefetch
                className={cn(
                  "relative whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-wider transition-opacity duration-150 sm:px-4 sm:text-xs",
                  active
                    ? "text-white"
                    : "text-[var(--color-dock-muted)] hover:text-white/90"
                )}
              >
                {active && !reduce && (
                  <motion.span
                    layoutId="dock-pill"
                    className="absolute inset-0 rounded-full bg-white/12"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <Link
          href={localizedPath(locale, "/contact")}
          prefetch
          className="ml-1 shrink-0 rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-black transition-colors hover:bg-[var(--color-accent-hover)] sm:px-5 sm:text-xs"
        >
          {dict.common.dockCta}
        </Link>
      </motion.nav>
    </div>
  );
}
