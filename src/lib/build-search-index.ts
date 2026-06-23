import { getBlogPosts } from "@/lib/data";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath, type Locale } from "@/i18n/config";
import { slugForDbCategory } from "@/lib/blog-categories";
import type { SearchIndexItem } from "@/lib/search";

function workHref(locale: Locale, slug: string): string {
  if (slug === "quickcopy") {
    return localizedPath(locale, `/works/${slug}`);
  }
  return localizedPath(locale, "/works");
}

export async function buildSearchIndex(locale: Locale): Promise<SearchIndexItem[]> {
  const [posts, dict] = await Promise.all([
    getBlogPosts({ locale }),
    getDictionary(locale),
  ]);

  const categoryLabels = Object.fromEntries(
    dict.blog.categories.map((c) => [c.slug, c.label])
  );

  const blogItems: SearchIndexItem[] = posts
    .filter((post) => post.published)
    .map((post) => {
      const slug = slugForDbCategory(post.category);
      return {
        id: `blog-${post.slug}`,
        kind: "blog" as const,
        title: post.title,
        excerpt: post.excerpt,
        href: localizedPath(locale, `/blog/${post.slug}`),
        tags: post.tags,
        categoryLabel: slug ? categoryLabels[slug] : post.category,
      };
    });

  const workItems: SearchIndexItem[] = dict.home.projects.items.map(
    (project) => ({
      id: `work-${project.slug}`,
      kind: "work" as const,
      title: project.title,
      excerpt: project.description,
      href: workHref(locale, project.slug),
      tags: project.tags,
      categoryLabel: dict.common.work,
    })
  );

  return [...blogItems, ...workItems];
}
