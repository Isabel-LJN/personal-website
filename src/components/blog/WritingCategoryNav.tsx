"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { localizedPath } from "@/i18n/config";
import { useLocale } from "@/i18n/locale-context";
import type { BlogCategorySlug } from "@/lib/blog-categories";

interface CategoryItem {
  slug: BlogCategorySlug;
  label: string;
}

interface WritingCategoryNavProps {
  categories: CategoryItem[];
  filterLabel: string;
  className?: string;
}

export function WritingCategoryNav({
  categories,
  filterLabel,
  className,
}: WritingCategoryNavProps) {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const active =
    (searchParams.get("category") as BlogCategorySlug | null) ??
    categories[0]?.slug;
  const reduce = useReducedMotion();

  return (
    <nav
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3", className)}
      aria-label={filterLabel}
    >
      <span className="aw-label shrink-0 text-[var(--color-text-dim)]">
        {filterLabel}
      </span>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = active === cat.slug;
          const href = `${localizedPath(locale, "/blog")}?category=${cat.slug}`;

          return (
            <Link
              key={cat.slug}
              href={href}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                  : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-foreground)]/8 hover:text-[var(--color-foreground)]"
              )}
            >
              {cat.label}
              {isActive && !reduce && (
                <motion.span
                  layoutId="writing-category-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--color-foreground)]"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
