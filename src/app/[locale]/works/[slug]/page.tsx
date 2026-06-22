import Link from "next/link";
import { notFound } from "next/navigation";
import { QuickCopyShowcase } from "@/components/works/QuickCopyShowcase";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createMetadata,
  createBreadcrumbJsonLd,
  buildSiteConfig,
} from "@/lib/seo";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  localizedPath,
  type LocaleParams,
  locales,
  isValidLocale,
} from "@/i18n/config";
import {
  WORK_DETAIL_SLUGS,
  hasWorkDetail,
} from "@/components/works/WorksProjectGrid";

interface WorkDetailPageProps {
  params: Promise<LocaleParams & { slug: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    WORK_DETAIL_SLUGS.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: WorkDetailPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam) || !hasWorkDetail(slug)) return {};
  const dict = await getDictionary(localeParam);
  const qc = dict.works.quickcopy;

  return createMetadata({
    locale: localeParam,
    siteName: dict.meta.siteName,
    title: qc.name,
    description: qc.tagline,
    path: `/works/${slug}`,
  });
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();
  if (!hasWorkDetail(slug)) notFound();

  const dict = await getDictionary(localeParam);
  const site = buildSiteConfig(dict.meta);
  const qc = dict.works.quickcopy;

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          {
            name: dict.meta.siteName,
            url: `${site.url}${localizedPath(localeParam, "/")}`,
          },
          {
            name: dict.works.subtitle,
            url: `${site.url}${localizedPath(localeParam, "/works")}`,
          },
          {
            name: qc.name,
            url: `${site.url}${localizedPath(localeParam, `/works/${slug}`)}`,
          },
        ])}
      />

      <header className="pt-10 pb-10 sm:pt-12 lg:pt-14">
        <div className="editorial-container">
          <Link
            href={localizedPath(localeParam, "/works")}
            className="mb-6 inline-flex text-sm text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-foreground)]"
          >
            ← {dict.works.backToWorks}
          </Link>
          <p className="aw-label mb-3">{dict.works.subtitle}</p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            {qc.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            {qc.tagline}
          </p>
        </div>
      </header>

      <section className="pb-20 lg:pb-32">
        <div className="editorial-container">
          <QuickCopyShowcase dict={dict} />
        </div>
      </section>
    </>
  );
}
