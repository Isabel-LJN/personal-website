import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { locales, localizedPath, ogLocales } from "@/i18n/config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const giteeUrl = "https://gitee.com/ljnsixsixsix";

export interface SiteMeta {
  siteName: string;
  siteDescription: string;
  authorName: string;
  authorTagline: string;
  email: string;
}

export function buildSiteConfig(meta: SiteMeta) {
  return {
    name: meta.siteName,
    description: meta.siteDescription,
    url: siteUrl,
    ogImage: `${siteUrl}/og-default.jpg`,
    author: {
      name: meta.authorName,
      title: meta.authorTagline,
      email: meta.email,
    },
    links: {
      gitee: giteeUrl,
    },
  };
}

export interface PageSEOProps {
  title?: string;
  description?: string;
  path?: string;
  locale?: Locale;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noIndex?: boolean;
  siteName?: string;
}

export function createMetadata({
  title,
  description,
  path = "",
  locale = "en",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  noIndex = false,
  siteName = "Isabel",
}: PageSEOProps = {}): Metadata {
  const localized = localizedPath(locale, path);
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const url = `${siteUrl}${localized}`;
  const ogImage = image ?? `${siteUrl}/og-default.jpg`;

  const languages = Object.fromEntries(
    locales.map((l) => [l, `${siteUrl}${localizedPath(l, path)}`])
  );

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
      languages: {
        ...languages,
        "x-default": `${siteUrl}${localizedPath("en", path)}`,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName,
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => ogLocales[l]),
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}

export function createArticleJsonLd(
  article: {
    title: string;
    description: string;
    slug: string;
    publishedAt: string;
    updatedAt?: string;
    image?: string;
    tags?: string[];
  },
  meta: SiteMeta,
  locale: Locale = "en"
) {
  const site = buildSiteConfig(meta);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image ?? site.ogImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    author: {
      "@type": "Person",
      name: meta.authorName,
      url: site.url,
    },
    publisher: {
      "@type": "Organization",
      name: meta.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}${localizedPath(locale, `/blog/${article.slug}`)}`,
    },
    keywords: article.tags?.join(", "),
  };
}

export function createPersonJsonLd(meta: SiteMeta) {
  const site = buildSiteConfig(meta);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: meta.authorName,
    jobTitle: meta.authorTagline,
    url: site.url,
    email: meta.email,
    sameAs: [giteeUrl],
    knowsAbout: [
      "Search Engine Optimization",
      "Software Development",
      "AI Workflows",
      "Product Building",
    ],
  };
}

export function createWebsiteJsonLd(meta: SiteMeta, locale: Locale = "en") {
  const site = buildSiteConfig(meta);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: meta.siteName,
    url: site.url,
    description: meta.siteDescription,
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    author: {
      "@type": "Person",
      name: meta.authorName,
    },
  };
}

export function createBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
