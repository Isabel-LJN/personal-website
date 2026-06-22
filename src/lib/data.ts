import prisma from "@/lib/prisma";
import {
  fallbackBlogPosts,
  fallbackCaseStudies,
  fallbackProjects,
  fallbackStats,
} from "@/data/fallback";
import type { BlogPost, CaseStudy, Project, Stat } from "@/types";
import {
  dbCategoryForSlug,
  type BlogCategorySlug,
} from "@/lib/blog-categories";
import { getLocalizedBlogFields } from "@/i18n/blog-posts";
import type { Locale } from "@/i18n/config";

function localizeBlogPost(post: BlogPost, locale: Locale): BlogPost {
  const localized = getLocalizedBlogFields(post.slug, locale);
  if (!localized) return post;
  return {
    ...post,
    title: localized.title,
    excerpt: localized.excerpt,
    content: localized.content,
    tags: localized.tags,
    seoTitle: localized.seoTitle ?? post.seoTitle,
    seoDesc: localized.seoDesc ?? post.seoDesc,
  };
}

function localizeBlogPosts(posts: BlogPost[], locale?: Locale): BlogPost[] {
  if (!locale) return posts;
  return posts.map((post) => localizeBlogPost(post, locale));
}

async function isDbAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function getStats(): Promise<Stat[]> {
  if (!(await isDbAvailable())) return fallbackStats;
  try {
    const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });
    return stats.length > 0 ? stats : fallbackStats;
  } catch {
    return fallbackStats;
  }
}

export async function getProjects(featuredOnly = false): Promise<Project[]> {
  if (!(await isDbAvailable())) {
    return featuredOnly
      ? fallbackProjects.filter((p) => p.featured)
      : fallbackProjects;
  }
  try {
    const projects = await prisma.project.findMany({
      where: featuredOnly ? { featured: true } : undefined,
      orderBy: { order: "asc" },
    });
    return projects.length > 0
      ? projects
      : featuredOnly
        ? fallbackProjects.filter((p) => p.featured)
        : fallbackProjects;
  } catch {
    return featuredOnly
      ? fallbackProjects.filter((p) => p.featured)
      : fallbackProjects;
  }
}

export async function getBlogPosts(options?: {
  featured?: boolean;
  category?: string;
  categorySlug?: BlogCategorySlug;
  limit?: number;
  locale?: Locale;
}): Promise<BlogPost[]> {
  const dbCategory = options?.categorySlug
    ? dbCategoryForSlug(options.categorySlug)
    : options?.category;

  if (!(await isDbAvailable())) {
    let posts = [...fallbackBlogPosts];
    if (options?.featured) posts = posts.filter((p) => p.featured);
    if (dbCategory) posts = posts.filter((p) => p.category === dbCategory);
    if (options?.limit) posts = posts.slice(0, options.limit);
    posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    return localizeBlogPosts(posts, options?.locale);
  }
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        ...(options?.featured && { featured: true }),
        ...(dbCategory && { category: dbCategory }),
      },
      orderBy: { publishedAt: "desc" },
      ...(options?.limit && { take: options.limit }),
    });
    let result =
      posts.length > 0 ? (posts as BlogPost[]) : [...fallbackBlogPosts];
    if (posts.length > 0) {
      const dbSlugs = new Set(posts.map((p) => p.slug));
      const extras = fallbackBlogPosts.filter(
        (p) =>
          !dbSlugs.has(p.slug) &&
          p.published &&
          (!dbCategory || p.category === dbCategory) &&
          (!options?.featured || p.featured)
      );
      result = [...result, ...extras];
    }
    if (dbCategory && posts.length === 0) {
      result = fallbackBlogPosts.filter((p) => p.category === dbCategory);
    }
    if (options?.featured) result = result.filter((p) => p.featured);
    if (options?.limit) result = result.slice(0, options.limit);
    result.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    return localizeBlogPosts(result, options?.locale);
  } catch {
    let posts = [...fallbackBlogPosts];
    if (options?.featured) posts = posts.filter((p) => p.featured);
    if (dbCategory) posts = posts.filter((p) => p.category === dbCategory);
    if (options?.limit) posts = posts.slice(0, options.limit);
    posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    return localizeBlogPosts(posts, options?.locale);
  }
}

export async function getBlogPostBySlug(
  slug: string,
  locale?: Locale
): Promise<BlogPost | null> {
  if (!(await isDbAvailable())) {
    const post = fallbackBlogPosts.find((p) => p.slug === slug) ?? null;
    return post && locale ? localizeBlogPost(post, locale) : post;
  }
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    const base = post
      ? (post as BlogPost)
      : (fallbackBlogPosts.find((p) => p.slug === slug) ?? null);
    if (!base) return null;
    return locale ? localizeBlogPost(base, locale) : base;
  } catch {
    const post = fallbackBlogPosts.find((p) => p.slug === slug) ?? null;
    return post && locale ? localizeBlogPost(post, locale) : post;
  }
}

export async function getCaseStudies(options?: {
  featured?: boolean;
  category?: string;
}): Promise<CaseStudy[]> {
  if (!(await isDbAvailable())) {
    let studies = [...fallbackCaseStudies];
    if (options?.featured) studies = studies.filter((s) => s.featured);
    if (options?.category)
      studies = studies.filter((s) => s.category === options.category);
    return studies;
  }
  try {
    const studies = await prisma.caseStudy.findMany({
      where: {
        published: true,
        ...(options?.featured && { featured: true }),
        ...(options?.category && { category: options.category }),
      },
      orderBy: { publishedAt: "desc" },
    });
    return studies.length > 0
      ? (studies as CaseStudy[])
      : fallbackCaseStudies;
  } catch {
    return fallbackCaseStudies;
  }
}

export async function getCaseStudyBySlug(
  slug: string
): Promise<CaseStudy | null> {
  if (!(await isDbAvailable())) {
    return fallbackCaseStudies.find((s) => s.slug === slug) ?? null;
  }
  try {
    const study = await prisma.caseStudy.findUnique({ where: { slug } });
    if (study) return study as CaseStudy;
    return fallbackCaseStudies.find((s) => s.slug === slug) ?? null;
  } catch {
    return fallbackCaseStudies.find((s) => s.slug === slug) ?? null;
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((p) => p.slug);
}

export async function getAllCaseStudySlugs(): Promise<string[]> {
  const studies = await getCaseStudies();
  return studies.map((s) => s.slug);
}
