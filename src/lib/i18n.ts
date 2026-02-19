export const SUPPORTED_LOCALES = ["es", "en", "fr"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";
export const NON_DEFAULT_LOCALES: ReadonlyArray<Locale> = SUPPORTED_LOCALES.filter(
  (locale) => locale !== DEFAULT_LOCALE,
);

export const LOCALE_CODE_LABEL: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  fr: "FR",
};

export const LOCALE_NAME_LABEL: Record<Locale, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
};

export const LOCALE_HTML_TAG: Record<Locale, string> = {
  es: "es-MX",
  en: "en-US",
  fr: "fr-FR",
};

export const LOCALE_OG_TAG: Record<Locale, string> = {
  es: "es_MX",
  en: "en_US",
  fr: "fr_FR",
};

export function normalizeLocale(value: string | undefined): Locale {
  const lowered = (value || "").toLowerCase();
  if (SUPPORTED_LOCALES.includes(lowered as Locale)) {
    return lowered as Locale;
  }
  return DEFAULT_LOCALE;
}

export function normalizeRoutePath(route: string): string {
  if (!route || route === "/") return "/";

  const normalized = route.replace(/^\/|\/$/g, "");
  if (!normalized) return "/";
  if (/^index\.html$/i.test(normalized)) return "/";

  const withoutTrailingIndex = normalized.replace(/\/index\.html$/i, "");
  if (!withoutTrailingIndex) return "/";

  return `/${withoutTrailingIndex}/`;
}

export function localizedPath(route: string, locale: Locale): string {
  const normalizedRoute = normalizeRoutePath(route);
  if (locale === DEFAULT_LOCALE) {
    return normalizedRoute;
  }

  if (normalizedRoute === "/") {
    return `/${locale}/`;
  }

  return `/${locale}${normalizedRoute}`;
}

export function stripLocalePrefix(pathname: string): { locale: Locale; route: string } {
  const normalizedPath = normalizeRoutePath(pathname);
  const match = normalizedPath.match(/^\/(en|fr)(\/.*|\/)$/i);

  if (!match) {
    return {
      locale: DEFAULT_LOCALE,
      route: normalizedPath,
    };
  }

  const locale = normalizeLocale(match[1]);
  const remainder = match[2] || "/";
  const route = normalizeRoutePath(remainder);

  return { locale, route };
}

export function localizeInternalUrl(urlValue: string, locale: Locale): string {
  const rootIndexMatch = urlValue.match(/^index\.html([?#].*)?$/i);
  if (rootIndexMatch) {
    return `${localizedPath("/", locale)}${rootIndexMatch[1] ?? ""}`;
  }

  if (locale === DEFAULT_LOCALE) return urlValue;
  if (!urlValue.startsWith("/") || urlValue.startsWith("//")) return urlValue;

  if (
    /^\/(?:wp-content|wp-includes|wp-admin|wp-json|feed(?:\/|$)|comments(?:\/|$)|_astro(?:\/|$)|favicon(?:\.|\/)|sitemap\.xml|robots\.txt|xmlrpc\.php)/i.test(
      urlValue,
    )
  ) {
    return urlValue;
  }

  try {
    const parsed = new URL(urlValue, "https://local.jld");
    const { route } = stripLocalePrefix(parsed.pathname);
    parsed.pathname = localizedPath(route, locale);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return urlValue;
  }
}

export function localizeInternalLinks(markup: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return markup;

  return markup.replace(
    /\b(href|action)=("|')([^"']+)\2/gi,
    (_fullMatch, attribute: string, quote: string, value: string): string =>
      `${attribute}=${quote}${localizeInternalUrl(value, locale)}${quote}`,
  );
}

type NavLabelMap = Record<string, string>;
const NAV_LABELS: Record<Exclude<Locale, "es">, NavLabelMap> = {
  en: {
    Inicio: "Home",
    Servicios: "Services",
    Sucursales: "Locations",
    Colecciones: "Collections",
    Nosotros: "About",
    Contacto: "Contact",
    Search: "Search",
  },
  fr: {
    Inicio: "Accueil",
    Servicios: "Services",
    Sucursales: "Salons",
    Colecciones: "Collections",
    Nosotros: "À propos",
    Contacto: "Contact",
    Search: "Recherche",
  },
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function localizeNavigationLabels(markup: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return markup;

  let localized = markup;
  const dictionary = NAV_LABELS[locale];

  for (const [source, target] of Object.entries(dictionary)) {
    const escapedSource = escapeRegExp(source);

    localized = localized.replace(
      new RegExp(`(<span[^>]*class=["'][^"']*avia-menu-text[^"']*["'][^>]*>\\s*)${escapedSource}(\\s*<\\/span>)`, "gi"),
      `$1${target}$2`,
    );

    localized = localized.replace(
      new RegExp(`(<span[^>]*class=["'][^"']*avia_hidden_link_text[^"']*["'][^>]*>\\s*)${escapedSource}(\\s*<\\/span>)`, "gi"),
      `$1${target}$2`,
    );
  }

  return localized;
}

function buildLanguageSwitchMarkup(route: string, locale: Locale): string {
  const items = SUPPORTED_LOCALES.map((entryLocale) => {
    const href = localizedPath(route, entryLocale);
    const activeClass = entryLocale === locale ? " is-active" : "";
    const localeTag = LOCALE_HTML_TAG[entryLocale];
    const codeLabel = LOCALE_CODE_LABEL[entryLocale];
    const nameLabel = LOCALE_NAME_LABEL[entryLocale];

    return `<li><a class="jld-lang-switch__link${activeClass}" href="${href}" hreflang="${localeTag}" lang="${localeTag}" aria-label="${nameLabel}">${codeLabel}</a></li>`;
  }).join("");

  return `<li id="menu-item-language-switch" class="menu-item menu-item-avia-special noMobile jld-lang-switch" role="menuitem"><details class="jld-lang-switch__details"><summary class="jld-lang-switch__summary"><span class="jld-lang-switch__code">${LOCALE_CODE_LABEL[locale]}</span><span class="jld-lang-switch__caret" aria-hidden="true"></span></summary><ul class="jld-lang-switch__menu" role="list">${items}</ul></details></li>`;
}

export function injectLanguageSwitch(markup: string, route: string, locale: Locale): string {
  if (!markup || markup.includes('id="menu-item-language-switch"')) return markup;

  const languageSwitchMarkup = buildLanguageSwitchMarkup(route, locale);

  const withSearchInsertion = markup.replace(
    /(<li[^>]*id=(["'])menu-item-search\2[\s\S]*?<\/li>)/i,
    `${languageSwitchMarkup}$1`,
  );

  if (withSearchInsertion !== markup) {
    return withSearchInsertion;
  }

  return markup.replace(
    /(<ul[^>]*id=(["'])avia-menu\2[^>]*>)([\s\S]*?)(<\/ul>)/i,
    `$1$3${languageSwitchMarkup}$4`,
  );
}

type Replacement = readonly [string, string];

function replaceInSegment(segment: string, replacements: ReadonlyArray<Replacement>): string {
  let localized = segment;

  for (const [source, target] of replacements) {
    if (!source || source === target) continue;
    localized = localized.split(source).join(target);
  }

  return localized;
}

function applyReplacements(markup: string, replacements: ReadonlyArray<Replacement>): string {
  if (!markup || replacements.length === 0) return markup;

  const protectedBlockRegex = /(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>)/gi;
  const parts = markup.split(protectedBlockRegex);

  return parts
    .map((part, index) => (index % 2 === 0 ? replaceInSegment(part, replacements) : part))
    .join("");
}

const COMMON_TEXT_REPLACEMENTS: Record<Exclude<Locale, "es">, ReadonlyArray<Replacement>> = {
  en: [
    ["Personalización hasta el infinito", "Infinite Personalization"],
    ["Personalización Hasta el Infinito", "Infinite Personalization"],
    ["Conócenos", "Learn More"],
    ["Citas", "Appointments"],
    ["Agenda tu Cita", "Book Your Appointment"],
    ["Haz tu Cita por WhatsApp ahora", "Book on WhatsApp Now"],
    ["Aviso de Privacidad", "Privacy Notice"],
    ["Redes Sociales", "Social Media"],
    ["Mas notas", "More Posts"],
    ["Buscar", "Search"],
    ["CONTACTO", "CONTACT"],
    ["SUCURSALES", "LOCATIONS"],
    ["SERVICIOS", "SERVICES"],
    ["Servicios", "Services"],
    ["Sucursales", "Locations"],
    ["Nosotros", "About"],
    ["Colecciones", "Collections"],
    ["Contacto", "Contact"],
    ["Envíanos un mensaje", "Send us a message"],
    ["Datos de contacto", "Contact Details"],
    ["Sucursal Santa Fe", "Santa Fe Branch"],
    ["Sucursal Polanco", "Polanco Branch"],
    ["Nombre*", "Name*"],
    ["Teléfono / WhatsApp*", "Phone / WhatsApp*"],
    ["Nombre", "Name"],
    ["Teléfono / WhatsApp", "Phone / WhatsApp"],
    ["Mensaje", "Message"],
    ["Enviar mensaje", "Send Message"],
    ["Nuestros Servicios", "Our Services"],
    ["Cortes", "Haircuts"],
    ["Corte Dama", "Women's Haircut"],
    ["Corte Caballero", "Men's Haircut"],
    ["Director Artístico Dama", "Art Director Women's Cut"],
    ["Director Artístico Caballero", "Art Director Men's Cut"],
    ["Peinado", "Styling"],
    ["Peinado Corto", "Short Styling"],
    ["Peinado Mediano", "Medium Styling"],
    ["peinado Largo", "Long Styling"],
    ["Peinado Extra Largo", "Extra Long Styling"],
    ["Peinado Recogido", "Updo Styling"],
    ["Nota: el precio puede variar por tipo de peinado, largo y densidad de cabello.", "Note: prices may vary depending on hairstyle type, length, and hair density."],
    ["Manicure y Pedicure", "Manicure and Pedicure"],
    ["Manicure Normal", "Classic Manicure"],
    ["Manicure con Gel", "Gel Manicure"],
    ["Manicure Spa", "Spa Manicure"],
    ["Pedicura", "Pedicure"],
    ["Pedicura con Gel", "Gel Pedicure"],
    ["Pedicura Spa", "Spa Pedicure"],
    ["Cambio de Esmalte", "Polish Change"],
    ["Remover Gel", "Gel Removal"],
    ["Remover Set Acrílico", "Acrylic Set Removal"],
    ["Set de Uñas de Acrílico", "Acrylic Nail Set"],
    ["Parche de Uña", "Nail Patch"],
    ["Uña de Arcílico (c/u)", "Acrylic Nail (each)"],
    ["Barbería", "Barbering"],
    ["Bigote", "Mustache"],
    ["Media Barba", "Half Beard"],
    ["Sucursales en México", "Locations in Mexico"],
    ["Jean Louis David México", "Jean Louis David Mexico"],
    ["Conoce más", "Learn More"],
    ["Un Legado de Innovación y Pasión", "A Legacy of Innovation and Passion"],
    ["Jean Louis David en el Mundo", "Jean Louis David Around the World"],
    ["Aspectos de la Colección", "Collection Looks"],
    ["Looks de la Colección &#8211; Primavera Verano 2024", "Spring-Summer 2024 Collection Looks"],
    ["Looks de la colección Primavera-Verano 2023", "Spring-Summer 2023 Collection Looks"],
    ["¡Adopta el bob (cuadrado), EL corte de moda de la temporada!", "Try the bob cut, THE trend haircut of the season!"],
    ["Mixlight, la técnica emblemática de Jean Louis David para iluminar el cabello", "Mixlight, Jean Louis David's signature technique to illuminate hair"],
  ],
  fr: [
    ["Personalización hasta el infinito", "Personnalisation a l'infini"],
    ["Personalización Hasta el Infinito", "Personnalisation a l'infini"],
    ["Conócenos", "Nous decouvrir"],
    ["Citas", "Rendez-vous"],
    ["Agenda tu Cita", "Prenez rendez-vous"],
    ["Haz tu Cita por WhatsApp ahora", "Prendre rendez-vous sur WhatsApp"],
    ["Aviso de Privacidad", "Politique de confidentialite"],
    ["Redes Sociales", "Reseaux sociaux"],
    ["Mas notas", "Plus d'articles"],
    ["Buscar", "Rechercher"],
    ["CONTACTO", "CONTACT"],
    ["SUCURSALES", "SALONS"],
    ["SERVICIOS", "SERVICES"],
    ["Servicios", "Services"],
    ["Sucursales", "Salons"],
    ["Nosotros", "A propos"],
    ["Colecciones", "Collections"],
    ["Contacto", "Contact"],
    ["Envíanos un mensaje", "Envoyez-nous un message"],
    ["Datos de contacto", "Coordonnees"],
    ["Sucursal Santa Fe", "Salon Santa Fe"],
    ["Sucursal Polanco", "Salon Polanco"],
    ["Nombre*", "Nom*"],
    ["Teléfono / WhatsApp*", "Telephone / WhatsApp*"],
    ["Nombre", "Nom"],
    ["Teléfono / WhatsApp", "Telephone / WhatsApp"],
    ["Mensaje", "Message"],
    ["Enviar mensaje", "Envoyer le message"],
    ["Nuestros Servicios", "Nos services"],
    ["Cortes", "Coupes"],
    ["Corte Dama", "Coupe Femme"],
    ["Corte Caballero", "Coupe Homme"],
    ["Director Artístico Dama", "Directeur Artistique Femme"],
    ["Director Artístico Caballero", "Directeur Artistique Homme"],
    ["Peinado", "Coiffage"],
    ["Peinado Corto", "Coiffage court"],
    ["Peinado Mediano", "Coiffage mi-long"],
    ["peinado Largo", "Coiffage long"],
    ["Peinado Extra Largo", "Coiffage extra long"],
    ["Peinado Recogido", "Coiffure attachee"],
    ["Extra Largo", "extra long"],
    ["Recogido", "attachee"],
    ["con Gel", "gel"],
    ["Nota: el precio puede variar por tipo de peinado, largo y densidad de cabello.", "Note : le prix peut varier selon le type de coiffage, la longueur et la densite des cheveux."],
    ["Manicure y Pedicure", "Manucure et Pedicure"],
    ["Manicure Normal", "Manucure classique"],
    ["Manicure con Gel", "Manucure gel"],
    ["Manicure Spa", "Manucure spa"],
    ["Pedicura", "Pedicure"],
    ["Pedicura con Gel", "Pedicure gel"],
    ["Pedicura Spa", "Pedicure spa"],
    ["Cambio de Esmalte", "Changement de vernis"],
    ["Remover Gel", "Retrait gel"],
    ["Remover Set Acrílico", "Retrait set acrylique"],
    ["Set de Uñas de Acrílico", "Pose complete acrylique"],
    ["Parche de Uña", "Reparation ongle"],
    ["Uña de Arcílico (c/u)", "Ongle acrylique (unite)"],
    ["Barbería", "Barbier"],
    ["Bigote", "Moustache"],
    ["Media Barba", "Demi barbe"],
    ["Sucursales en México", "Salons au Mexique"],
    ["Jean Louis David México", "Jean Louis David Mexique"],
    ["Conoce más", "En savoir plus"],
    ["Un Legado de Innovación y Pasión", "Un heritage d'innovation et de passion"],
    ["Jean Louis David en el Mundo", "Jean Louis David dans le monde"],
    ["Aspectos de la Colección", "Looks de la collection"],
    ["Looks de la Colección &#8211; Primavera Verano 2024", "Looks de la collection Printemps-Ete 2024"],
    ["Looks de la colección Primavera-Verano 2023", "Looks de la collection Printemps-Ete 2023"],
    ["¡Adopta el bob (cuadrado), EL corte de moda de la temporada!", "Adoptez le carre, LA coupe tendance de la saison !"],
    ["Mixlight, la técnica emblemática de Jean Louis David para iluminar el cabello", "Mixlight, la technique signature de Jean Louis David pour illuminer les cheveux"],
    ["Scroll to top", "Retour en haut"],
  ],
};

const ROUTE_TEXT_REPLACEMENTS: Record<
  Exclude<Locale, "es">,
  Partial<Record<string, ReadonlyArray<Replacement>>>
> = {
  en: {
    "/": [
      [
        "Descubre la Experiencia Jean Louis David: Innovación y Elegancia en Cada Estilo",
        "Discover the Jean Louis David Experience: Innovation and Elegance in Every Style",
      ],
      [
        "En Jean Louis David, no solo creamos estilos, creamos experiencias. Nuestra pasión es redefinir el arte de la belleza capilar, fusionando innovación, sofisticación y un enfoque personalizado. Cada visita a nuestros salones es una oportunidad para descubrir una nueva versión de ti, guiado por nuestros expertos estilistas que combinan las últimas tendencias con técnicas exclusivas.",
        "At Jean Louis David, we do not only create styles, we create experiences. Our passion is to redefine hair beauty by blending innovation, sophistication and a personalized approach. Every visit to our salons is a chance to discover a new version of yourself, guided by our expert stylists who combine the latest trends with exclusive techniques.",
      ],
      [
        "Estamos aquí para hacerte sentir y verte espectacular.",
        "We are here to make you feel and look spectacular.",
      ],
    ],
    "/servicios/": [
      [
        "En Jean Louis David, ofrecemos una selección de servicios de para realzar tu belleza. Nuestros expertos están listos para brindarte cortes, peinados, barbería y tratamientos para manos y pies con la máxima atención al detalle. Descubre la diferencia en cada visita.",
        "At Jean Louis David, we offer a selection of services to enhance your beauty. Our experts are ready to provide haircuts, styling, barbering, and hand and foot treatments with exceptional attention to detail. Discover the difference in every visit.",
      ],
    ],
    "/sucursales/": [
      [
        "Encuentra tu salón Jean Louis David más cercano y vive una experiencia de belleza exclusiva. Visítanos en nuestras sucursales y disfruta del mejor cuidado capilar y estilismo con un enfoque personalizado y la excelencia que nos distingue.",
        "Find your nearest Jean Louis David salon and enjoy an exclusive beauty experience. Visit our locations and discover premium hair care and styling with a personalized approach and the excellence that defines us.",
      ],
    ],
    "/nosotros/": [
      [
        "Jean Louis David: Innovación y Estilo que Trasciende",
        "Jean Louis David: Innovation and Style That Endures",
      ],
      [
        "Desde 1961, Jean Louis David ha transformado el estilismo en un arte, siempre un paso adelante en la evolución de los gustos y deseos de nuestros clientes. Nuestra misión es hacer que cada visita a nuestros salones sea una experiencia de belleza única y personalizada.",
        "Since 1961, Jean Louis David has transformed hairstyling into an art, always one step ahead of evolving client tastes and desires. Our mission is to make every salon visit a unique and personalized beauty experience.",
      ],
      [
        "Un Legado de Innovación y Pasión",
        "A Legacy of Innovation and Passion",
      ],
      [
        "Personalización Hasta el Infinito",
        "Infinite Personalization",
      ],
    ],
    "/contacto/": [
      [
        "¿Deseas más información sobre nuestros servicios? No dudes en contactarnos, nuestro equipo en Jean Louis David estará encantado de asistirte.",
        "Would you like more information about our services? Feel free to contact us, our Jean Louis David team will be happy to assist you.",
      ],
    ],
    "/colecciones/": [
      [
        "Un viento de audacia anuncia la primavera. Un soplo de libertad caracteriza el verano. Este es el humor de Jean Louis David para la estación cálida.",
        "A wave of boldness announces spring. A breath of freedom defines summer. This is Jean Louis David's mood for the warm season.",
      ],
      [
        "Continuando con la temporada anterior, los cortes y colores inspirados en el underground te invitan a cambiar los códigos, a inventar tus propias reglas y a destacar entre la multitud.",
        "Continuing from last season, underground-inspired cuts and colors invite you to break the rules, create your own codes, and stand out from the crowd.",
      ],
    ],
  },
  fr: {
    "/": [
      [
        "Descubre la Experiencia Jean Louis David: Innovación y Elegancia en Cada Estilo",
        "Decouvrez l'experience Jean Louis David : innovation et elegance dans chaque style",
      ],
      [
        "En Jean Louis David, no solo creamos estilos, creamos experiencias. Nuestra pasión es redefinir el arte de la belleza capilar, fusionando innovación, sofisticación y un enfoque personalizado. Cada visita a nuestros salones es una oportunidad para descubrir una nueva versión de ti, guiado por nuestros expertos estilistas que combinan las últimas tendencias con técnicas exclusivas.",
        "Chez Jean Louis David, nous ne creons pas seulement des styles, nous creons des experiences. Notre passion est de reinventer l'art de la beaute capillaire en associant innovation, sophistication et approche personnalisee. Chaque visite est l'occasion de decouvrir une nouvelle version de vous-meme, guidee par nos stylistes experts.",
      ],
      [
        "Estamos aquí para hacerte sentir y verte espectacular.",
        "Nous sommes la pour vous faire sentir et paraitre spectaculaire.",
      ],
    ],
    "/servicios/": [
      [
        "En Jean Louis David, ofrecemos una selección de servicios de para realzar tu belleza. Nuestros expertos están listos para brindarte cortes, peinados, barbería y tratamientos para manos y pies con la máxima atención al detalle. Descubre la diferencia en cada visita.",
        "Chez Jean Louis David, nous proposons une selection de services pour sublimer votre beaute. Nos experts realisent coupes, coiffages, services barbier et soins mains/pieds avec une attention maximale aux details. Decouvrez la difference a chaque visite.",
      ],
    ],
    "/sucursales/": [
      [
        "Encuentra tu salón Jean Louis David más cercano y vive una experiencia de belleza exclusiva. Visítanos en nuestras sucursales y disfruta del mejor cuidado capilar y estilismo con un enfoque personalizado y la excelencia que nos distingue.",
        "Trouvez le salon Jean Louis David le plus proche et vivez une experience beaute exclusive. Visitez nos salons et profitez du meilleur soin capillaire avec une approche personnalisee et l'excellence qui nous distingue.",
      ],
    ],
    "/nosotros/": [
      [
        "Jean Louis David: Innovación y Estilo que Trasciende",
        "Jean Louis David : innovation et style qui traversent le temps",
      ],
      [
        "Desde 1961, Jean Louis David ha transformado el estilismo en un arte, siempre un paso adelante en la evolución de los gustos y deseos de nuestros clientes. Nuestra misión es hacer que cada visita a nuestros salones sea una experiencia de belleza única y personalizada.",
        "Depuis 1961, Jean Louis David a transforme la coiffure en art, toujours un pas en avance sur l'evolution des envies de ses clients. Notre mission est de faire de chaque visite une experience beaute unique et personnalisee.",
      ],
      [
        "Un Legado de Innovación y Pasión",
        "Un heritage d'innovation et de passion",
      ],
      [
        "Personalización Hasta el Infinito",
        "Personnalisation a l'infini",
      ],
    ],
    "/contacto/": [
      [
        "¿Deseas más información sobre nuestros servicios? No dudes en contactarnos, nuestro equipo en Jean Louis David estará encantado de asistirte.",
        "Vous souhaitez plus d'informations sur nos services ? N'hesitez pas a nous contacter, l'equipe Jean Louis David sera ravie de vous accompagner.",
      ],
    ],
    "/colecciones/": [
      [
        "Un viento de audacia anuncia la primavera. Un soplo de libertad caracteriza el verano. Este es el humor de Jean Louis David para la estación cálida.",
        "Un vent d'audace annonce le printemps. Un souffle de liberte caracterise l'ete. C'est l'esprit Jean Louis David pour la belle saison.",
      ],
      [
        "Continuando con la temporada anterior, los cortes y colores inspirados en el underground te invitan a cambiar los códigos, a inventar tus propias reglas y a destacar entre la multitud.",
        "Dans la continuite de la saison precedente, les coupes et couleurs inspirees de l'underground vous invitent a bousculer les codes, inventer vos propres regles et sortir du lot.",
      ],
    ],
  },
};

export function localizePageContent(markup: string, locale: Locale, route: string): string {
  if (locale === DEFAULT_LOCALE) return markup;

  const normalizedRoute = normalizeRoutePath(route);
  const commonReplacements = COMMON_TEXT_REPLACEMENTS[locale];
  const routeReplacements = ROUTE_TEXT_REPLACEMENTS[locale][normalizedRoute] ?? [];

  return applyReplacements(markup, [...routeReplacements, ...commonReplacements]);
}
