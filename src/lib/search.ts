export type SearchItemKind = "blog" | "work";

export interface SearchIndexItem {
  id: string;
  kind: SearchItemKind;
  title: string;
  excerpt: string;
  href: string;
  tags: string[];
  categoryLabel?: string;
}

export function filterSearchIndex(
  items: SearchIndexItem[],
  query: string,
  limit = 12
): SearchIndexItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items.slice(0, limit);

  const tokens = q.split(/\s+/).filter(Boolean);

  return items
    .filter((item) => {
      const haystack = [
        item.title,
        item.excerpt,
        item.categoryLabel ?? "",
        ...item.tags,
      ]
        .join(" ")
        .toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    })
    .slice(0, limit);
}
