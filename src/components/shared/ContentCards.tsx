import Link from "next/link";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import { localizedPath } from "@/i18n/config";
import { slugForDbCategory } from "@/lib/blog-categories";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

interface BlogCardProps {
  post: BlogPost;
  locale: Locale;
  dict: Dictionary;
}

export function BlogCard({ post, locale, dict }: BlogCardProps) {
  const categorySlug = slugForDbCategory(post.category);
  const categoryLabel =
    dict.blog.categories.find((c) => c.slug === categorySlug)?.label ??
    post.category;

  return (
    <Link
      href={localizedPath(locale, `/blog/${post.slug}`)}
      className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5 transition-all duration-300 hover:border-[var(--color-foreground)]/15 hover:bg-[var(--color-surface)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-6"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[var(--color-accent)]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-foreground)]">
          {categoryLabel}
        </span>
        <span className="text-xs text-[var(--color-text-dim)]">
          {formatDate(post.publishedAt, locale)}
        </span>
        <span className="text-xs text-[var(--color-text-dim)]">
          · {post.readTime} {dict.common.minRead}
        </span>
      </div>

      <h3 className="text-lg font-bold leading-snug tracking-tight text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-text-secondary)] sm:text-xl">
        {post.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {post.excerpt}
      </p>

      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-foreground)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {dict.common.readMore}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const html = content
    .replace(
      /^# (.+)$/gm,
      '<h2 class="text-2xl font-bold tracking-tight mb-6 mt-10 first:mt-0 text-[var(--color-foreground)]">$1</h2>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h3 class="text-lg font-bold tracking-tight mb-4 mt-8 text-[var(--color-foreground)]">$1</h3>'
    )
    .replace(
      /^### (.+)$/gm,
      '<h4 class="text-base font-semibold mb-3 mt-6 text-[var(--color-foreground)]">$1</h4>'
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-semibold text-[var(--color-foreground)]">$1</strong>'
    )
    .replace(
      /^- (.+)$/gm,
      '<li class="ml-4 list-disc text-[var(--color-text-secondary)]">$1</li>'
    )
    .replace(
      /^(\d+)\. (.+)$/gm,
      '<li class="ml-4 list-decimal text-[var(--color-text-secondary)]">$2</li>'
    )
    .replace(
      /\n\n/g,
      '</p><p class="leading-relaxed mb-4 text-[var(--color-text-secondary)]">'
    )
    .replace(/^(?!<[hluop])/gm, (match) =>
      match.trim()
        ? `<p class="leading-relaxed mb-4 text-[var(--color-text-secondary)]">${match}`
        : match
    );

  return (
    <article
      className="prose-custom max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
