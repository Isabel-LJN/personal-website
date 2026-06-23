"use client";

import type { BlogPost } from "@/types";
import { BlogCard } from "@/components/shared/ContentCards";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
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
      <div className="writing-empty rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/30 px-6 py-24 text-center">
        <p className="aw-body text-[var(--color-text-dim)]">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <Stagger className="grid gap-5 sm:grid-cols-2 lg:gap-6">
      {posts.map((post) => (
        <StaggerItem key={post.id}>
          <BlogCard post={post} locale={locale} dict={dict} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
