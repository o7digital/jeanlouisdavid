import {
  DEFAULT_LOCALE,
  LOCALE_HTML_TAG,
  localizedPath,
  type Locale,
} from "./i18n";

export const DEFAULT_SITE_URL = "https://jeanlouisdavid.com.mx";

export function normalizeSiteUrl(rawUrl: string | undefined): string {
  const fallback = DEFAULT_SITE_URL;
  if (!rawUrl) return fallback;

  const trimmed = rawUrl.trim().replace(/\/+$/, "");
  if (!trimmed) return fallback;

  try {
    const url = new URL(trimmed);
    return url.toString().replace(/\/+$/, "");
  } catch {
    return fallback;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.SITE_URL || process.env.PUBLIC_SITE_URL);

const DESCRIPTION_BY_ROUTE: Record<Locale, Map<string, string>> = {
  es: new Map<string, string>([
    [
      "/",
      "Descubre la experiencia Jean Louis David en Mexico: servicios de estilismo, color, barberia y atencion personalizada.",
    ],
    [
      "/servicios/",
      "Conoce nuestros servicios de corte, peinado, manicure, pedicure y barberia con atencion experta y personalizada.",
    ],
    [
      "/sucursales/",
      "Ubica las sucursales Jean Louis David en Mexico y agenda tu cita en el salon mas cercano.",
    ],
    [
      "/nosotros/",
      "Conoce la filosofia, estilo y propuesta de Jean Louis David para una experiencia de belleza distintiva.",
    ],
    [
      "/colecciones/",
      "Explora las colecciones y tendencias de Jean Louis David para inspirar tu siguiente look.",
    ],
    [
      "/contacto/",
      "Contacta a Jean Louis David y agenda tu cita por WhatsApp para una asesoria personalizada.",
    ],
    [
      "/privacidad/",
      "Consulta el aviso de privacidad de Jean Louis David Mexico.",
    ],
  ]),
  en: new Map<string, string>([
    [
      "/",
      "Discover the Jean Louis David experience in Mexico: styling, color, barbering and personalized salon care.",
    ],
    [
      "/servicios/",
      "Explore our haircut, styling, manicure, pedicure and barbering services with expert, personalized attention.",
    ],
    [
      "/sucursales/",
      "Find Jean Louis David locations in Mexico and book your appointment at the nearest salon.",
    ],
    [
      "/nosotros/",
      "Learn about Jean Louis David's philosophy, style and signature beauty approach.",
    ],
    [
      "/colecciones/",
      "Browse Jean Louis David collections and trend inspiration for your next look.",
    ],
    [
      "/contacto/",
      "Contact Jean Louis David and book your appointment via WhatsApp for personalized guidance.",
    ],
    [
      "/privacidad/",
      "Review Jean Louis David Mexico's privacy notice.",
    ],
  ]),
  fr: new Map<string, string>([
    [
      "/",
      "Decouvrez l'experience Jean Louis David au Mexique: coiffure, coloration, barbier et accompagnement personnalise.",
    ],
    [
      "/servicios/",
      "Decouvrez nos services de coupe, coiffage, manucure, pedicure et barbier avec une attention experte et personnalisee.",
    ],
    [
      "/sucursales/",
      "Trouvez les salons Jean Louis David au Mexique et prenez rendez-vous dans la succursale la plus proche.",
    ],
    [
      "/nosotros/",
      "Decouvrez la philosophie, le style et la proposition Jean Louis David pour une experience beaute distinctive.",
    ],
    [
      "/colecciones/",
      "Explorez les collections et tendances Jean Louis David pour inspirer votre prochain look.",
    ],
    [
      "/contacto/",
      "Contactez Jean Louis David et prenez rendez-vous via WhatsApp pour un conseil personnalise.",
    ],
    [
      "/privacidad/",
      "Consultez la politique de confidentialite de Jean Louis David Mexique.",
    ],
  ]),
};

const DEFAULT_DESCRIPTION_BY_LOCALE: Record<Locale, string> = {
  es: "Jean Louis David Mexico: estilismo, tendencias y servicios premium para cuidar y transformar tu imagen.",
  en: "Jean Louis David Mexico: premium styling, trends and salon services to elevate your look.",
  fr: "Jean Louis David Mexique: coiffure, tendances et services premium pour sublimer votre image.",
};

const TITLE_BY_ROUTE: Record<Locale, Map<string, string>> = {
  es: new Map<string, string>([
    ["/", "Jean Louis David - Salon CDMX"],
    ["/servicios/", "Servicios - Jean Louis David"],
    ["/sucursales/", "Sucursales - Jean Louis David"],
    ["/nosotros/", "Nosotros - Jean Louis David"],
    ["/colecciones/", "Colecciones - Jean Louis David"],
    ["/contacto/", "Contacto - Jean Louis David"],
    ["/privacidad/", "Aviso de Privacidad - Jean Louis David"],
  ]),
  en: new Map<string, string>([
    ["/", "Jean Louis David - Mexico City Salon"],
    ["/servicios/", "Services - Jean Louis David"],
    ["/sucursales/", "Locations - Jean Louis David"],
    ["/nosotros/", "About - Jean Louis David"],
    ["/colecciones/", "Collections - Jean Louis David"],
    ["/contacto/", "Contact - Jean Louis David"],
    ["/privacidad/", "Privacy Notice - Jean Louis David"],
  ]),
  fr: new Map<string, string>([
    ["/", "Jean Louis David - Salon a Mexico"],
    ["/servicios/", "Services - Jean Louis David"],
    ["/sucursales/", "Salons - Jean Louis David"],
    ["/nosotros/", "A propos - Jean Louis David"],
    ["/colecciones/", "Collections - Jean Louis David"],
    ["/contacto/", "Contact - Jean Louis David"],
    ["/privacidad/", "Politique de confidentialite - Jean Louis David"],
  ]),
};

const HOME_LABEL_BY_LOCALE: Record<Locale, string> = {
  es: "Inicio",
  en: "Home",
  fr: "Accueil",
};

const DEFAULT_OG_IMAGE = "/wp-content/uploads/2024/07/slide_01-1280x630.webp";

export function canonicalPath(route: string): string {
  if (!route || route === "/") return "/";
  return `/${route.replace(/^\/|\/$/g, "")}/`;
}

export function canonicalPathForLocale(route: string, locale: Locale): string {
  return localizedPath(canonicalPath(route), locale);
}

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${SITE_URL}/`).toString();
}

export function extractTitleFromHead(headHtml: string): string {
  const titleMatch = headHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return decodeHtml(titleMatch?.[1] ?? "Jean Louis David Mexico");
}

export function getSeoDescription(route: string, locale: Locale = DEFAULT_LOCALE): string {
  const normalizedRoute = canonicalPath(route);
  return (
    DESCRIPTION_BY_ROUTE[locale].get(normalizedRoute) ??
    DEFAULT_DESCRIPTION_BY_LOCALE[locale]
  );
}

export function getSeoTitle(
  route: string,
  fallbackTitle: string,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return TITLE_BY_ROUTE[locale].get(canonicalPath(route)) ?? fallbackTitle;
}

export function getSeoImageUrl(): string {
  return absoluteUrl(DEFAULT_OG_IMAGE);
}

export type JsonLdParams = {
  canonical: string;
  description: string;
  route: string;
  title: string;
  locale?: Locale;
};

export function getJsonLd({
  canonical,
  description,
  route,
  title,
  locale = DEFAULT_LOCALE,
}: JsonLdParams): string {
  const routePath = canonicalPath(route);
  const languageTag = LOCALE_HTML_TAG[locale];
  const homePath = canonicalPathForLocale("/", locale);
  const sitePath = canonicalPathForLocale("/", locale);

  const items = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Jean Louis David Mexico",
      url: SITE_URL,
      logo: absoluteUrl("/wp-content/uploads/2024/07/logo-bco.webp"),
      sameAs: ["https://www.instagram.com/jldavid_mx"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Jean Louis David Mexico",
      url: absoluteUrl(sitePath),
      inLanguage: languageTag,
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl(sitePath)}?s={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonical,
      inLanguage: languageTag,
      isPartOf: {
        "@type": "WebSite",
        name: "Jean Louis David Mexico",
        url: absoluteUrl(sitePath),
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: HOME_LABEL_BY_LOCALE[locale],
            item: absoluteUrl(homePath),
          },
          ...(routePath === "/"
            ? []
            : [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: title,
                  item: canonical,
                },
              ]),
        ],
      },
    },
  ];

  return JSON.stringify(items);
}

function decodeHtml(value: string): string {
  return value
    .replace(/&#8211;/g, " - ")
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
