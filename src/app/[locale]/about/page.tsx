import { PageHeader } from "@/components/shared/PageHeader";
import { PersonalSection } from "@/components/home/PersonalSection";
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
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
    path: "/about",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) throw new Error("Invalid locale");
  const dict = await getDictionary(localeParam);
  const { about } = dict;
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
            name: about.subtitle,
            url: `${site.url}${localizedPath(localeParam, "/about")}`,
          },
        ])}
      />

      <PageHeader
        label={about.subtitle}
        title={about.title}
        description={about.description}
        showDivider={false}
      />

      <PersonalSection personal={about.personal} />
    </>
  );
}
