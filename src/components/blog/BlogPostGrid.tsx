"use client";

import type { BlogPost } from "@/types";
import { BlogCard } from "@/components/shared/ContentCards";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

interface BlogPostGridProps {
  posts: BlogPost[];
  locale: Locale;
  dict: Dictionary;
  emptyLabel: string;
}

export function BlogPostGrid({
  posts,
  locale,
  dict,
  emptyLabel,
}: BlogPostGridProps) {
  if (posts.length === 0) {
    return (
      <p className="aw-body py-24 text-center text-[var(--color-text-dim)]">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} locale={locale} dict={dict} />
      ))}
    </div>
  );
}
