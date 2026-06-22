import { ContactHero } from "@/components/contact/ContactHero";
import { ContactAside } from "@/components/contact/ContactAside";
import { ContactForm } from "@/components/shared/ContactForm";
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
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    path: "/contact",
  });
}

export default async function ContactPage({
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
            name: dict.contact.subtitle,
            url: `${site.url}${localizedPath(localeParam, "/contact")}`,
          },
        ])}
      />

      <ContactHero dict={dict} />

      <section className="pb-24 lg:pb-32">
        <div className="editorial-container">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-20">
            <ContactAside dict={dict} />

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:p-8 lg:p-10">
              <p className="aw-label mb-6">{dict.contact.aside.formTitle}</p>
              <ContactForm labels={dict.contact.form} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
