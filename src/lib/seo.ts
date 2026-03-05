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

type ArticleMetadata = {
  ogImagePath: string;
  datePublished: string;
  dateModified: string;
};

const ARTICLE_METADATA_BY_ROUTE = new Map<string, ArticleMetadata>([
  [
    "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
    {
      ogImagePath: "/wp-content/uploads/2024/07/VISUEL_1_BANNIERE_ARTICLE.webp",
      datePublished: "2024-07-23T02:41:19-06:00",
      dateModified: "2024-09-06T04:32:14-06:00",
    },
  ],
  [
    "/looks-de-la-coleccion-primavera-verano-2023/",
    {
      ogImagePath: "/wp-content/uploads/2024/07/FORMAT-1-HOME-PAGE-3-1280x450-1.webp",
      datePublished: "2024-07-23T02:41:19-06:00",
      dateModified: "2024-07-23T02:41:19-06:00",
    },
  ],
  [
    "/mixlight-la-tecnica-para-iluminar-el-cabello/",
    {
      ogImagePath: "/wp-content/uploads/2024/07/maxlight.webp",
      datePublished: "2024-07-23T02:41:19-06:00",
      dateModified: "2024-07-23T02:41:19-06:00",
    },
  ],
  [
    "/plurality-coleccion-primavera-verano-2024/",
    {
      ogImagePath: "/wp-content/uploads/2024/07/Plurality.webp",
      datePublished: "2024-07-23T02:41:19-06:00",
      dateModified: "2024-07-23T02:41:19-06:00",
    },
  ],
]);

const KEYWORDS_BY_ROUTE: Record<Locale, Map<string, string>> = {
  es: new Map<string, string>([
    [
      "/",
      "salón de belleza CDMX, peluquería Santa Fe, corte de cabello Polanco, coloración Mexico, peinados CDMX, estilista Santa Fe Polanco, tratamientos capilares Mexico, barbería CDMX",
    ],
    [
      "/servicios/",
      "corte de cabello Polanco, peinados profesionales CDMX, coloración premium Santa Fe, manicure pedicure Mexico, barbería Santa Fe, tratamientos capilares Polanco CDMX",
    ],
    [
      "/sucursales/",
      "salón Jean Louis David Mexico, peluquería Santa Fe, estilista Polanco, sucursales CDMX, salón de belleza Santa Fe Polanco",
    ],
    [
      "/nosotros/",
      "Jean Louis David Mexico, salón de belleza CDMX, peluquería francesa Santa Fe, estilista profesional Polanco",
    ],
    [
      "/colecciones/",
      "colecciones moda capilar Mexico, tendencias peinados CDMX, estilos Jean Louis David Santa Fe Polanco",
    ],
    [
      "/contacto/",
      "cita salón belleza CDMX, reserva peluquería Santa Fe, contacto Jean Louis David Polanco Mexico",
    ],
  ]),
  en: new Map<string, string>([
    [
      "/",
      "hair salon Mexico CDMX, hairdresser Santa Fe, haircut Polanco, hair coloring Mexico City, professional hairstylist CDMX, barber shop Santa Fe Polanco",
    ],
    [
      "/servicios/",
      "haircut Santa Fe, professional styling Polanco, premium hair color CDMX, manicure pedicure Mexico, barber services Santa Fe Polanco",
    ],
    [
      "/sucursales/",
      "Jean Louis David salon Mexico, hairdresser Santa Fe, stylist Polanco, beauty salon CDMX locations",
    ],
    [
      "/nosotros/",
      "Jean Louis David Mexico, French hair salon CDMX, professional stylist Santa Fe Polanco",
    ],
    [
      "/colecciones/",
      "hair fashion collections Mexico, hairstyle trends CDMX, Jean Louis David styles Santa Fe Polanco",
    ],
    [
      "/contacto/",
      "book hair salon CDMX, hair appointment Santa Fe, contact Jean Louis David Polanco Mexico",
    ],
  ]),
  fr: new Map<string, string>([
    [
      "/",
      "salon de coiffure Mexico CDMX, coiffeur Santa Fe, coupe cheveux Polanco, coloration Mexico, styliste CDMX, salon beauté Santa Fe Polanco",
    ],
    [
      "/servicios/",
      "coupe cheveux Santa Fe, coiffure professionnelle Polanco, coloration premium CDMX, manucure pédicure Mexico, barbier Santa Fe Polanco",
    ],
    [
      "/sucursales/",
      "salon Jean Louis David Mexico, coiffeur Santa Fe, styliste Polanco, salon de beauté CDMX",
    ],
    [
      "/nosotros/",
      "Jean Louis David Mexico, salon coiffure français CDMX, coiffeur professionnel Santa Fe Polanco",
    ],
    [
      "/colecciones/",
      "collections mode capillaire Mexico, tendances coiffure CDMX, styles Jean Louis David Santa Fe Polanco",
    ],
    [
      "/contacto/",
      "rendez-vous salon beauté CDMX, réservation coiffeur Santa Fe, contact Jean Louis David Polanco Mexico",
    ],
  ]),
};

const DESCRIPTION_BY_ROUTE: Record<Locale, Map<string, string>> = {
  es: new Map<string, string>([
    [
      "/",
      "Descubre la experiencia Jean Louis David en CDMX: servicios de estilismo, color, barbería y atención personalizada en Santa Fe y Polanco. Tu salón de belleza premium en Mexico.",
    ],
    [
      "/servicios/",
      "Conoce nuestros servicios de corte, peinado, coloración, manicure, pedicure y barbería en CDMX. Atención experta en Santa Fe y Polanco con técnicas exclusivas.",
    ],
    [
      "/sucursales/",
      "Ubica las sucursales Jean Louis David en CDMX (Santa Fe y Polanco) y agenda tu cita en el salón más cercano. Experiencia profesional en Mexico.",
    ],
    [
      "/nosotros/",
      "Conoce la filosofía y estilo Jean Louis David: salón de belleza premium en CDMX con presencia en Santa Fe y Polanco para una experiencia distintiva.",
    ],
    [
      "/colecciones/",
      "Explora las colecciones y tendencias de Jean Louis David en Mexico. Inspírate con los estilos de moda en CDMX, Santa Fe y Polanco.",
    ],
    [
      "/contacto/",
      "Contacta Jean Louis David en CDMX y agenda tu cita en Santa Fe o Polanco por WhatsApp. Asesoría personalizada en tu salón de confianza en Mexico.",
    ],
    [
      "/privacidad/",
      "Consulta el aviso de privacidad de Jean Louis David México.",
    ],
    [
      "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
      "Descubre cómo llevar el bob cuadrado, el corte tendencia de la temporada, con el sello de estilo Jean Louis David.",
    ],
    [
      "/looks-de-la-coleccion-primavera-verano-2023/",
      "Inspírate con los looks Primavera-Verano 2023 de Jean Louis David: cortes, color y movimiento para un estilo actual.",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Conoce Mixlight, la técnica exclusiva de Jean Louis David para iluminar el cabello y lograr reflejos naturales.",
    ],
    [
      "/plurality-coleccion-primavera-verano-2024/",
      "Explora los looks de la colección Primavera-Verano 2024 de Jean Louis David y encuentra tu próximo estilo.",
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
    [
      "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
      "Discover how to wear the bob cut, the season's trend hairstyle, with Jean Louis David's signature style.",
    ],
    [
      "/looks-de-la-coleccion-primavera-verano-2023/",
      "Get inspired by Jean Louis David Spring-Summer 2023 looks with modern cuts, color and movement.",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Discover Mixlight, Jean Louis David's signature technique to brighten hair with natural-looking highlights.",
    ],
    [
      "/plurality-coleccion-primavera-verano-2024/",
      "Explore Jean Louis David Spring-Summer 2024 collection looks and find your next signature style.",
    ],
  ]),
  fr: new Map<string, string>([
    [
      "/",
      "Découvrez l'expérience Jean Louis David au Mexique : coiffure, coloration, barbier et accompagnement personnalisé.",
    ],
    [
      "/servicios/",
      "Découvrez nos services de coupe, coiffage, manucure, pédicure et barbier avec une attention experte et personnalisée.",
    ],
    [
      "/sucursales/",
      "Trouvez les salons Jean Louis David au Mexique et prenez rendez-vous dans la succursale la plus proche.",
    ],
    [
      "/nosotros/",
      "Découvrez la philosophie, le style et la proposition Jean Louis David pour une expérience beauté distinctive.",
    ],
    [
      "/colecciones/",
      "Explorez les collections et tendances Jean Louis David pour inspirer votre prochain look.",
    ],
    [
      "/contacto/",
      "Contactez Jean Louis David et prenez rendez-vous via WhatsApp pour un conseil personnalisé.",
    ],
    [
      "/privacidad/",
      "Consultez la politique de confidentialité de Jean Louis David Mexique.",
    ],
    [
      "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
      "Découvrez comment adopter le carré, la coupe tendance de la saison, avec la signature Jean Louis David.",
    ],
    [
      "/looks-de-la-coleccion-primavera-verano-2023/",
      "Inspirez-vous des looks Printemps-Été 2023 Jean Louis David : coupes, couleur et mouvement.",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Découvrez Mixlight, la technique signature Jean Louis David pour illuminer les cheveux avec naturel.",
    ],
    [
      "/plurality-coleccion-primavera-verano-2024/",
      "Explorez les looks de la collection Printemps-Été 2024 Jean Louis David et trouvez votre prochain style.",
    ],
  ]),
};

const DEFAULT_DESCRIPTION_BY_LOCALE: Record<Locale, string> = {
  es: "Jean Louis David México: estilismo, tendencias y servicios premium para cuidar y transformar tu imagen.",
  en: "Jean Louis David Mexico: premium styling, trends and salon services to elevate your look.",
  fr: "Jean Louis David Mexique: coiffure, tendances et services premium pour sublimer votre image.",
};

const TITLE_BY_ROUTE: Record<Locale, Map<string, string>> = {
  es: new Map<string, string>([
    ["/", "Jean Louis David - Salón CDMX"],
    ["/servicios/", "Servicios - Jean Louis David"],
    ["/sucursales/", "Sucursales - Jean Louis David"],
    ["/nosotros/", "Nosotros - Jean Louis David"],
    ["/colecciones/", "Colecciones - Jean Louis David"],
    ["/contacto/", "Contacto - Jean Louis David"],
    ["/privacidad/", "Aviso de Privacidad - Jean Louis David"],
    [
      "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
      "¡Adopta el bob (cuadrado), EL corte de moda de la temporada! - Jean Louis David",
    ],
    [
      "/looks-de-la-coleccion-primavera-verano-2023/",
      "Looks de la colección Primavera-Verano 2023 - Jean Louis David",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Mixlight, la técnica emblemática de Jean Louis David para iluminar el cabello - Jean Louis David",
    ],
    [
      "/plurality-coleccion-primavera-verano-2024/",
      "Looks de la Colección - Primavera Verano 2024 - Jean Louis David",
    ],
  ]),
  en: new Map<string, string>([
    ["/", "Jean Louis David - Mexico City Salon"],
    ["/servicios/", "Services - Jean Louis David"],
    ["/sucursales/", "Locations - Jean Louis David"],
    ["/nosotros/", "About - Jean Louis David"],
    ["/colecciones/", "Collections - Jean Louis David"],
    ["/contacto/", "Contact Us - Jean Louis David"],
    ["/privacidad/", "Privacy Notice - Jean Louis David"],
    [
      "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
      "Try the bob cut, THE trend haircut of the season! - Jean Louis David",
    ],
    [
      "/looks-de-la-coleccion-primavera-verano-2023/",
      "Spring-Summer 2023 Collection Looks - Jean Louis David",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Mixlight, Jean Louis David's signature technique to illuminate hair - Jean Louis David",
    ],
    [
      "/plurality-coleccion-primavera-verano-2024/",
      "Spring-Summer 2024 Collection Looks - Jean Louis David",
    ],
  ]),
  fr: new Map<string, string>([
    ["/", "Jean Louis David - Salon à Mexico"],
    ["/servicios/", "Services - Jean Louis David"],
    ["/sucursales/", "Salons - Jean Louis David"],
    ["/nosotros/", "À propos - Jean Louis David"],
    ["/colecciones/", "Collections - Jean Louis David"],
    ["/contacto/", "Contact - Jean Louis David"],
    ["/privacidad/", "Politique de confidentialité - Jean Louis David"],
    [
      "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
      "Adoptez le carré, LA coupe tendance de la saison ! - Jean Louis David",
    ],
    [
      "/looks-de-la-coleccion-primavera-verano-2023/",
      "Aperçus de la collection Printemps-Été 2023 - Jean Louis David",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Mixlight, la technique signature de Jean Louis David pour illuminer les cheveux - Jean Louis David",
    ],
    [
      "/plurality-coleccion-primavera-verano-2024/",
      "Aperçus de la collection Printemps-Été 2024 - Jean Louis David",
    ],
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

export function getSeoKeywords(route: string, locale: Locale = DEFAULT_LOCALE): string {
  const normalizedRoute = canonicalPath(route);
  return KEYWORDS_BY_ROUTE[locale].get(normalizedRoute) ?? "";
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

function getArticleMetadata(route: string): ArticleMetadata | undefined {
  return ARTICLE_METADATA_BY_ROUTE.get(canonicalPath(route));
}

function stripBrandSuffix(value: string): string {
  return value.replace(/\s*-\s*Jean Louis David\s*$/i, "").trim();
}

export function getSeoImageUrl(route: string = "/"): string {
  return absoluteUrl(getArticleMetadata(route)?.ogImagePath ?? DEFAULT_OG_IMAGE);
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
  const articleMetadata = getArticleMetadata(routePath);

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

  if (articleMetadata) {
    items.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: stripBrandSuffix(title),
      description,
      image: [absoluteUrl(articleMetadata.ogImagePath)],
      datePublished: articleMetadata.datePublished,
      dateModified: articleMetadata.dateModified,
      inLanguage: languageTag,
      url: canonical,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
      author: {
        "@type": "Organization",
        name: "Jean Louis David Mexico",
      },
      publisher: {
        "@type": "Organization",
        name: "Jean Louis David Mexico",
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/wp-content/uploads/2024/07/logo-bco.webp"),
        },
      },
    });
  }

  return JSON.stringify(items);
}

export function getFooterKeywords(locale: Locale = DEFAULT_LOCALE): string[] {
  const keywords = getSeoKeywords("/", locale);
  if (!keywords) return [];
  return keywords.split(",").map((k) => k.trim());
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
