import { Hero } from "@/components/home/Hero";
import { StorySection } from "@/components/home/StorySection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { OpenSourceSection } from "@/components/home/OpenSourceSection";
import { WritingPreview } from "@/components/home/WritingPreview";
import { ClosingSection } from "@/components/home/ClosingSection";
import { getBlogPosts } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { getDictionary } from "@/i18n/get-dictionary";
import type { LocaleParams } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const dict = await getDictionary(localeParam);
  return createMetadata({
    locale: localeParam,
    siteName: dict.meta.siteName,
    title: dict.meta.authorTagline,
    description: dict.meta.siteDescription,
    path: "/",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) throw new Error("Invalid locale");
  const dict = await getDictionary(localeParam);
  const featuredPosts = await getBlogPosts({
    featured: true,
    limit: 2,
    locale: localeParam,
  });

  return (
    <>
      <Hero locale={localeParam} dict={dict} />
      <StorySection dict={dict} />
      <FeaturedProjects locale={localeParam} dict={dict} />
      <OpenSourceSection dict={dict} />
      <WritingPreview locale={localeParam} dict={dict} posts={featuredPosts} />
      <ClosingSection locale={localeParam} dict={dict} />
    </>
  );
}
