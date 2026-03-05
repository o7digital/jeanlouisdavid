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
      "peluquería CDMX, corte de cabello CDMX, coloración capilar CDMX, peinados CDMX, barbería CDMX, salón capilar Santa Fe CDMX Cuajimalpa, salón capilar Polanco CDMX, Mixlight Jean Louis David",
    ],
    [
      "/servicios/",
      "servicios capilares CDMX, corte dama CDMX, corte caballero CDMX, peinado profesional CDMX, coloración capilar CDMX, barbería profesional CDMX, tratamientos capilares CDMX",
    ],
    [
      "/sucursales/",
      "sucursal Jean Louis David Santa Fe CDMX Cuajimalpa, sucursal Jean Louis David Polanco CDMX, salón capilar Santa Fe CDMX, salón capilar Polanco CDMX, cita de cabello CDMX",
    ],
    [
      "/nosotros/",
      "historia capilar Jean Louis David, estilismo capilar en CDMX, expertos en corte y color CDMX, peluquería profesional Jean Louis David",
    ],
    [
      "/colecciones/",
      "tendencias de cabello Jean Louis David, cortes de moda CDMX, peinados de temporada, inspiración coloración capilar",
    ],
    [
      "/contacto/",
      "contacto cita capilar CDMX, WhatsApp peluquería CDMX, cita Santa Fe CDMX Cuajimalpa, cita Polanco CDMX, reservar corte color peinado CDMX",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Mixlight Jean Louis David, iluminar el cabello con Mixlight, coloración Mixlight CDMX, técnica capilar exclusiva Mixlight",
    ],
  ]),
  en: new Map<string, string>([
    [
      "/",
      "hair salon CDMX, haircut CDMX, hair color CDMX, hair styling CDMX, barber services CDMX, hair salon Santa Fe CDMX Cuajimalpa, hair salon Polanco CDMX, Mixlight Jean Louis David",
    ],
    [
      "/servicios/",
      "hair services CDMX, women's haircut CDMX, men's haircut CDMX, professional hair styling CDMX, hair color service CDMX, barber services CDMX, hair treatments CDMX",
    ],
    [
      "/sucursales/",
      "Jean Louis David Santa Fe CDMX Cuajimalpa branch, Jean Louis David Polanco CDMX branch, hair salon Santa Fe CDMX, hair salon Polanco CDMX, hair appointment CDMX",
    ],
    [
      "/nosotros/",
      "Jean Louis David hair legacy, hair styling experts CDMX, haircut and color specialists CDMX, professional hair salon CDMX",
    ],
    [
      "/colecciones/",
      "Jean Louis David hair trends, seasonal hairstyles CDMX, haircut inspiration, hair color inspiration",
    ],
    [
      "/contacto/",
      "hair appointment contact CDMX, WhatsApp hair booking CDMX, Santa Fe CDMX Cuajimalpa hair booking, Polanco CDMX hair booking, book haircut color styling CDMX",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Mixlight Jean Louis David, illuminate hair with Mixlight, Mixlight hair color CDMX, exclusive Mixlight technique",
    ],
  ]),
  fr: new Map<string, string>([
    [
      "/",
      "salon de coiffure CDMX, coupe de cheveux CDMX, coloration capillaire CDMX, coiffage CDMX, service barbe CDMX, salon capillaire Santa Fe CDMX Cuajimalpa, salon capillaire Polanco CDMX, Mixlight Jean Louis David",
    ],
    [
      "/servicios/",
      "services capillaires CDMX, coupe femme CDMX, coupe homme CDMX, coiffage professionnel CDMX, coloration capillaire CDMX, service barbe CDMX, traitements capillaires CDMX",
    ],
    [
      "/sucursales/",
      "succursale Jean Louis David Santa Fe CDMX Cuajimalpa, succursale Jean Louis David Polanco CDMX, salon capillaire Santa Fe CDMX, salon capillaire Polanco CDMX, rendez-vous coiffure CDMX",
    ],
    [
      "/nosotros/",
      "heritage capillaire Jean Louis David, experts coiffure CDMX, spécialistes coupe et couleur CDMX, salon de coiffure professionnel CDMX",
    ],
    [
      "/colecciones/",
      "tendances cheveux Jean Louis David, coiffures de saison CDMX, inspiration coupe de cheveux, inspiration coloration capillaire",
    ],
    [
      "/contacto/",
      "contact rendez-vous coiffure CDMX, rendez-vous WhatsApp salon coiffure CDMX, rendez-vous Santa Fe CDMX Cuajimalpa, rendez-vous Polanco CDMX, reserver coupe couleur coiffage CDMX",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Mixlight Jean Louis David, illuminer les cheveux avec Mixlight, coloration Mixlight CDMX, technique Mixlight exclusive",
    ],
  ]),
};

const DESCRIPTION_BY_ROUTE: Record<Locale, Map<string, string>> = {
  es: new Map<string, string>([
    [
      "/",
      "Salón capilar Jean Louis David en CDMX con corte, coloración, peinado y barbería profesional en Santa Fe CDMX (Cuajimalpa) y Polanco CDMX.",
    ],
    [
      "/servicios/",
      "Servicios 100% capilares en CDMX: corte dama y caballero, peinado, coloración, tratamientos capilares y barbería profesional.",
    ],
    [
      "/sucursales/",
      "Ubica las sucursales Jean Louis David en CDMX (Santa Fe y Polanco) y agenda tu cita en el salón más cercano. Experiencia profesional en Mexico.",
    ],
    [
      "/nosotros/",
      "Conoce la historia y visión de Jean Louis David en corte, color y peinado personalizado para cada tipo de cabello.",
    ],
    [
      "/colecciones/",
      "Explora las colecciones y tendencias de Jean Louis David en Mexico. Inspírate con los estilos de moda en CDMX, Santa Fe y Polanco.",
    ],
    [
      "/contacto/",
      "Contacta a Jean Louis David en CDMX y agenda tu cita de cabello por WhatsApp en Santa Fe CDMX (Cuajimalpa) o Polanco CDMX.",
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
      "Explore our 100% hair services in CDMX: women's and men's haircuts, styling, hair color, hair treatments and barber services.",
    ],
    [
      "/sucursales/",
      "Find Jean Louis David locations in Mexico and book your appointment at the nearest salon.",
    ],
    [
      "/nosotros/",
      "Learn about Jean Louis David's hair philosophy, legacy and personalized approach to haircut, color and styling.",
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
      "Découvrez nos services 100% capillaires à CDMX : coupe femme/homme, coiffage, coloration, traitements capillaires et barbe.",
    ],
    [
      "/sucursales/",
      "Trouvez les salons Jean Louis David au Mexique et prenez rendez-vous dans la succursale la plus proche.",
    ],
    [
      "/nosotros/",
      "Découvrez la philosophie capillaire et l'héritage Jean Louis David autour de la coupe, de la couleur et du coiffage personnalisés.",
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
