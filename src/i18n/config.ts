export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "EN",
  zh: "中文",
};

export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  zh: "zh_CN",
};

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export type LocaleParams = { locale: string };

export async function resolveLocale(
  params: Promise<LocaleParams>
): Promise<Locale> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
  return locale;
}

export function localizedPath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  if (maybeLocale && isValidLocale(maybeLocale)) {
    const rest = segments.slice(1).join("/");
    return { locale: maybeLocale, path: rest ? `/${rest}` : "/" };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}
