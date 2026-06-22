import { PageHeader } from "@/components/shared/PageHeader";
import { WorksProjectGrid } from "@/components/works/WorksProjectGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createMetadata,
  createBreadcrumbJsonLd,
  buildSiteConfig,
} from "@/lib/seo";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath, type LocaleParams } from "@/i18n/config";
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
    title: dict.works.metaTitle,
    description: dict.works.metaDescription,
    path: "/works",
  });
}

export default async function WorksPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) throw new Error("Invalid locale");
  const dict = await getDictionary(localeParam);
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
            name: dict.works.subtitle,
            url: `${site.url}${localizedPath(localeParam, "/works")}`,
          },
        ])}
      />

      <PageHeader
        label={dict.works.subtitle}
        title={dict.works.title}
        description={dict.works.description}
        accent="ocean"
      />

      <section className="pb-20 lg:pb-32">
        <div className="editorial-container">
          <WorksProjectGrid locale={localeParam} dict={dict} />
        </div>
      </section>
    </>
  );
}
