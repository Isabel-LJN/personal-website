import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { WritingCategoryNav } from "@/components/blog/WritingCategoryNav";
import { BlogPostGrid } from "@/components/blog/BlogPostGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createMetadata,
  createBreadcrumbJsonLd,
  buildSiteConfig,
} from "@/lib/seo";
import { getBlogPosts } from "@/lib/data";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath, type LocaleParams } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";
import {
  blogCategorySlugs,
  resolveBlogCategorySlug,
} from "@/lib/blog-categories";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<LocaleParams>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const dict = await getDictionary(localeParam);
  const { category } = await searchParams;
  const slug = resolveBlogCategorySlug(category) ?? blogCategorySlugs[0];
  const catLabel =
    dict.blog.categories.find((c) => c.slug === slug)?.label ?? dict.blog.subtitle;

  return createMetadata({
    locale: localeParam,
    siteName: dict.meta.siteName,
    title: `${dict.blog.metaTitle} · ${catLabel}`,
    description: dict.blog.metaDescription,
    path: `/blog?category=${slug}`,
  });
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<LocaleParams>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) throw new Error("Invalid locale");

  const { category } = await searchParams;
  const categorySlug = resolveBlogCategorySlug(category);

  if (!categorySlug) {
    redirect(
      `${localizedPath(localeParam, "/blog")}?category=${blogCategorySlugs[0]}`
    );
  }

  const dict = await getDictionary(localeParam);
  const posts = await getBlogPosts({ categorySlug, locale: localeParam });
  const site = buildSiteConfig(dict.meta);

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          {
            name: dict.meta.siteName,
            url: `${site.url}${localizedPath(localeParam, "/")}`,
          },
          {
            name: dict.blog.subtitle,
            url: `${site.url}${localizedPath(localeParam, "/blog")}`,
          },
        ])}
      />

      <PageHeader
        label={dict.blog.subtitle}
        title={dict.blog.title}
        description={dict.blog.description}
        showDivider={false}
        accentLine
        interactiveTitle
        hiddenWords={dict.blog.hiddenWords}
      />

      <section className="pb-20 lg:pb-32">
        <div className="editorial-container">
          <div className="writing-filter-sticky">
            <Suspense fallback={<div className="h-14" />}>
              <WritingCategoryNav
                categories={dict.blog.categories}
                filterLabel={dict.blog.filterLabel}
              />
            </Suspense>
          </div>

          <div className="mt-10 lg:mt-14">
            <Suspense fallback={null}>
              <BlogPostGrid
                posts={posts}
                locale={localeParam}
                dict={dict}
                emptyLabel={dict.blog.empty}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
