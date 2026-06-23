import { NextRequest, NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/build-search-index";
import { defaultLocale, isValidLocale } from "@/i18n/config";

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale") ?? defaultLocale;
  const locale = isValidLocale(localeParam) ? localeParam : defaultLocale;

  try {
    const items = await buildSearchIndex(locale);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
