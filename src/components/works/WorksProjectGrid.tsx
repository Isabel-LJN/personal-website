import Link from "next/link";
import Image from "next/image";
import { localizedPath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

export const WORK_DETAIL_SLUGS = ["quickcopy"] as const;
export type WorkDetailSlug = (typeof WORK_DETAIL_SLUGS)[number];

export function hasWorkDetail(slug: string): slug is WorkDetailSlug {
  return WORK_DETAIL_SLUGS.includes(slug as WorkDetailSlug);
}

interface WorksProjectGridProps {
  locale: Locale;
  dict: Dictionary;
}

export function WorksProjectGrid({ locale, dict }: WorksProjectGridProps) {
  const { projects } = dict.home;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
      {projects.items.map((project) => {
        const detail = hasWorkDetail(project.slug);
        const href = detail
          ? localizedPath(locale, `/works/${project.slug}`)
          : undefined;

        const card = (
          <article
            className={
              detail
                ? "group flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5 transition-all duration-300 hover:border-[var(--color-foreground)]/15 hover:bg-[var(--color-surface)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-6"
                : "flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/30 p-5 sm:p-6"
            }
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {project.slug === "quickcopy" && (
                <span className="rounded-full bg-[var(--color-accent)]/30 px-2.5 py-0.5 text-[11px] font-semibold">
                  {dict.works.statusUnreleased}
                </span>
              )}
              <span className="text-[11px] text-[var(--color-text-dim)]">
                {project.year}
              </span>
              <span className="text-[11px] text-[var(--color-text-dim)]">
                · {project.status}
              </span>
            </div>

            {project.slug === "quickcopy" && (
              <div className="relative mb-4 h-10 w-10 overflow-hidden rounded-xl border border-[var(--color-border)]">
                <Image
                  src="/images/quickcopy/app-icon.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}

            <h3
              className={
                detail
                  ? "text-lg font-bold tracking-tight text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-text-secondary)]"
                  : "text-lg font-bold tracking-tight text-[var(--color-foreground)]"
              }
            >
              {project.title}
            </h3>

            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-dim)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {detail && (
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-foreground)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {dict.common.readMore}
                <span aria-hidden>→</span>
              </span>
            )}
          </article>
        );

        return href ? (
          <Link key={project.slug} href={href} className="block h-full">
            {card}
          </Link>
        ) : (
          <div key={project.slug}>{card}</div>
        );
      })}
    </div>
  );
}
