export const blogCategorySlugs = ["cs", "seo", "product"] as const;
export type BlogCategorySlug = (typeof blogCategorySlugs)[number];

/** Maps URL slug → database / fallback `category` field */
export const blogCategoryDbMap: Record<BlogCategorySlug, string> = {
  cs: "Computer Science",
  seo: "SEO",
  product: "Product",
};

export function isBlogCategorySlug(value: string): value is BlogCategorySlug {
  return blogCategorySlugs.includes(value as BlogCategorySlug);
}

export function resolveBlogCategorySlug(
  value?: string
): BlogCategorySlug | undefined {
  if (!value) return undefined;
  return isBlogCategorySlug(value) ? value : undefined;
}

export function dbCategoryForSlug(slug: BlogCategorySlug): string {
  return blogCategoryDbMap[slug];
}

export function slugForDbCategory(
  category: string
): BlogCategorySlug | undefined {
  const entry = Object.entries(blogCategoryDbMap).find(
    ([, dbCat]) => dbCat === category
  );
  return entry ? (entry[0] as BlogCategorySlug) : undefined;
}
