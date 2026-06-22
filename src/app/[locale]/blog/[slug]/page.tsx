import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { MarkdownContent } from "@/components/shared/ContentCards";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createMetadata,
  createArticleJsonLd,
  createBreadcrumbJsonLd,
  buildSiteConfig,
} from "@/lib/seo";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath, type LocaleParams, locales } from "@/i18n/config";
import { slugForDbCategory } from "@/lib/blog-categories";
import { isValidLocale } from "@/i18n/config";

interface BlogPostPageProps {
  params: Promise<LocaleParams & { slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) return {};
  const dict = await getDictionary(localeParam);
  const post = await getBlogPostBySlug(slug, localeParam);
  if (!post) return {};

  return createMetadata({
    locale: localeParam,
    siteName: dict.meta.siteName,
    title: post.seoTitle ?? post.title,
    description: post.seoDesc ?? post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage ?? undefined,
    type: "article",
    publishedTime: post.publishedAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const dict = await getDictionary(localeParam);
  const post = await getBlogPostBySlug(slug, localeParam);
  if (!post) notFound();

  const site = buildSiteConfig(dict.meta);
  const categorySlug = slugForDbCategory(post.category);
  const categoryLabel =
    dict.blog.categories.find((c) => c.slug === categorySlug)?.label ??
    post.category;
  const backHref = categorySlug
    ? `${localizedPath(localeParam, "/blog")}?category=${categorySlug}`
    : localizedPath(localeParam, "/blog");

  return (
    <>
      <JsonLd
        data={[
          createArticleJsonLd(
            {
              title: post.title,
              description: post.excerpt,
              slug: post.slug,
              publishedAt: post.publishedAt.toISOString(),
              updatedAt: post.updatedAt.toISOString(),
              image: post.coverImage ?? undefined,
              tags: post.tags,
            },
            dict.meta,
            localeParam
          ),
          createBreadcrumbJsonLd([
            { name: dict.meta.siteName, url: `${site.url}${localizedPath(localeParam, "/")}` },
            {
              name: dict.blog.subtitle,
              url: `${site.url}${localizedPath(localeParam, "/blog")}`,
            },
            {
              name: post.title,
              url: `${site.url}${localizedPath(localeParam, `/blog/${post.slug}`)}`,
            },
          ]),
        ]}
      />

      <article>
        <header className="pt-10 pb-10 sm:pt-12 lg:pt-14">
          <div className="editorial-container">
            <Link
              href={backHref}
              className="mb-8 inline-flex text-sm text-[var(--color-text-dim)] transition-colors hover:text-black"
            >
              ← {dict.blog.backToBlog}
            </Link>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="accent">{categoryLabel}</Badge>
              <span className="text-sm text-[var(--color-text-dim)]">
                {post.readTime} {dict.common.minRead}
              </span>
              <time dateTime={post.publishedAt.toString()} className="text-sm text-[var(--color-text-dim)]">
                {formatDate(post.publishedAt, localeParam)}
              </time>
            </div>

            <h1 className="headline-lg max-w-4xl text-balance">{post.title}</h1>
            <p className="body-lg mt-6 max-w-2xl">{post.excerpt}</p>
          </div>
        </header>

        {post.coverImage && (
          <div className="editorial-container">
            <div className="relative aspect-[2/1] overflow-hidden rounded-xl border border-[var(--color-border)]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1200px) 100vw, 1024px"
              />
            </div>
          </div>
        )}

        <div className="editorial-container py-14 lg:py-20">
          <div className="max-w-2xl">
            <MarkdownContent content={post.content} />
            <div className="mt-12 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
