import { datoRequest, logDatoCmsDebug } from "../lib/datocms";
import type { Locale } from "../lib/i18n";

export type DatoPage = {
  title?: string | null;
  slug?: string | null;
  route?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  heroTitle?: string | null;
  locale?: string | null;
};

type DatoPagesResponse = {
  allPages?: DatoPage[];
};

const PAGES_QUERY = `
  query Pages {
    allPages {
      title
      slug
      route
      seoTitle
      seoDescription
      heroTitle
      locale
    }
  }
`;

function normalizeRoute(route: string): string {
  if (!route || route === "/") return "/";
  return `/${route.replace(/^\/|\/$/g, "")}/`;
}

export async function getDatoPageByRoute(route: string, locale: Locale): Promise<DatoPage | null> {
  const normalizedRoute = normalizeRoute(route);
  const data = await datoRequest<DatoPagesResponse>(PAGES_QUERY);
  const pages = data?.allPages ?? [];

  logDatoCmsDebug("page records", {
    route: normalizedRoute,
    locale,
    total: pages.length,
    records: pages.map((page) => ({
      title: page.title,
      route: page.route,
      locale: page.locale,
      heroTitle: page.heroTitle,
    })),
  });

  return (
    pages.find((page) => {
      const pageLocale = page.locale?.trim();
      return normalizeRoute(page.route ?? "") === normalizedRoute && (!pageLocale || pageLocale === locale);
    }) ?? null
  );
}

