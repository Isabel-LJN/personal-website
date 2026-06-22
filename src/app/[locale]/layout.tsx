import { notFound } from "next/navigation";
import { HtmlLang } from "@/components/layout/HtmlLang";
import { IntroSplash } from "@/components/layout/IntroSplash";
import { BottomDock } from "@/components/layout/BottomDock";
import { ScrollTopButton } from "@/components/layout/ScrollTopButton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { LocaleProvider } from "@/i18n/locale-context";
import { isValidLocale, locales, type LocaleParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  createMetadata,
  createPersonJsonLd,
  createWebsiteJsonLd,
} from "@/lib/seo";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
    description: dict.meta.siteDescription,
    path: "/",
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LocaleParams>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const dict = await getDictionary(localeParam);
  const meta = {
    siteName: dict.meta.siteName,
    siteDescription: dict.meta.siteDescription,
    authorName: dict.meta.authorName,
    authorTagline: dict.meta.authorTagline,
    email: dict.meta.email,
  };

  return (
    <>
      <HtmlLang locale={localeParam} />
      <JsonLd
        data={[
          createPersonJsonLd(meta),
          createWebsiteJsonLd(meta, localeParam),
        ]}
      />
      <LocaleProvider locale={localeParam} dict={dict}>
        <IntroSplash />
        <Header />
        <main>{children}</main>
        <Footer locale={localeParam} dict={dict} />
        <BottomDock />
        <ScrollTopButton />
      </LocaleProvider>
    </>
  );
}
