import Link from "next/link";
import Image from "next/image";
import { localizedPath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { giteeUrl } from "@/lib/seo";
import { FooterReels } from "@/components/layout/FooterReels";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

type FooterLink =
  | { label: string; href: string; external?: false }
  | { label: string; href: string; external: true };

export function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const footerLinks: FooterLink[] = [
    ...dict.nav.map((item) => ({ ...item, external: false as const })),
    { label: dict.common.work, href: "/works", external: false },
    { label: dict.common.contact, href: "/contact", external: false },
    { label: "Gitee", href: giteeUrl, external: true },
  ];

  function linkHref(item: FooterLink) {
    if (item.external) return item.href;
    if (item.href === "/blog") {
      return `${localizedPath(locale, "/blog")}?category=cs`;
    }
    return localizedPath(locale, item.href);
  }

  const linkClass =
    "whitespace-nowrap text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-foreground)] sm:text-[13px]";

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)] pb-24">
      <div className="editorial-container py-5 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={localizedPath(locale, "/")}
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-70"
          >
            <span className="relative h-7 w-7 overflow-hidden rounded-full border border-[var(--color-border)] bg-white">
              <Image
                src="/logo.png"
                alt=""
                fill
                className="object-cover"
                sizes="28px"
              />
            </span>
            <span className="hidden text-xs font-semibold text-[var(--color-foreground)] sm:inline">
              {dict.meta.siteName}
            </span>
            <span className="aw-label hidden text-[var(--color-text-dim)] sm:inline">
              © {year}
            </span>
          </Link>

          <div className="flex min-w-0 items-center justify-end gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden">
            <nav
              className="flex shrink-0 items-center"
              aria-label={dict.common.navigation}
            >
              {footerLinks.map((item, i) => (
                <span key={item.href} className="inline-flex items-center">
                  {i > 0 && (
                    <span className="mx-1 sm:mx-1.5 text-[var(--color-text-dim)]/50 select-none">
                      ·
                    </span>
                  )}
                  {item.external ? (
                    <a
                      href={linkHref(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={linkHref(item)} className={linkClass}>
                      {item.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

            <span className="h-3 w-px shrink-0 bg-[var(--color-border)]" />

            <FooterReels reels={dict.footer.reels} />
          </div>
        </div>
      </div>
    </footer>
  );
}
