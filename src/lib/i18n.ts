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
    Contacto: "Contact Us",
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
  const orderedReplacements = [...replacements].sort(
    ([sourceA], [sourceB]) => sourceB.length - sourceA.length,
  );
  let localized = segment;

  for (let pass = 0; pass < 4; pass += 1) {
    let next = localized;

    for (const [source, target] of orderedReplacements) {
      if (!source || source === target) continue;
      next = next.split(source).join(target);
    }

    if (next === localized) {
      break;
    }

    localized = next;
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
    ["Nuestros Servicios", "Our Services"],
    ["Nuestros Services", "Our Services"],
    ["Nuestro Services", "Our Services"],
    ["Nuestras Sucursales", "Our Salons"],
    ["Nuestras Locations", "Our Salons"],
    ["Sucursales en México", "Our Salons in Mexico"],
    ["Locations en México", "Our Salons in Mexico"],
    ["Acerca de Nosotros", "About"],
    ["Conócenos", "Learn More"],
    ["Citas", "Appointments"],
    ["Agenda tu Cita", "Book Your Appointment"],
    ["Haz tu Cita por WhatsApp ahora", "Book on WhatsApp Now"],
    ["Aviso de Privacidad", "Privacy Notice"],
    ["Redes Sociales", "Social Media"],
    ["Mas notas", "More Posts"],
    ["Buscar", "Search"],
    ["CONTACTO", "CONTACT US"],
    ["SUCURSALES", "LOCATIONS"],
    ["SERVICIOS", "SERVICES"],
    ["Servicios", "Services"],
    ["Sucursales", "Locations"],
    ["Nosotros", "About"],
    ["Colecciones", "Collections"],
    ["Contacto", "Contact Us"],
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
    ["Jean Louis David México", "Jean Louis David Mexico"],
    ["Conoce más", "Learn More"],
    ["Un Legado de Innovación y Pasión", "A Legacy of Innovation and Passion"],
    ["Jean Louis David en el Mundo", "Jean Louis David Around the World"],
    ["Aspectos de la Colección", "Collection Looks"],
    ["Looks de la Colección &#8211; Primavera Verano 2024", "Spring-Summer 2024 Collection Looks"],
    ["Looks de la colección Primavera-Verano 2023", "Spring-Summer 2023 Collection Looks"],
    ["¡Adopta el bob (cuadrado), EL corte de moda de la temporada!", "Try the bob cut, THE trend haircut of the season!"],
    ["Mixlight, la técnica emblemática de Jean Louis David para iluminar el cabello", "Mixlight, Jean Louis David&#39;s signature technique to illuminate hair"],
  ],
  fr: [
    ["Personalización hasta el infinito", "Personnalisation à l'infini"],
    ["Personalización Hasta el Infinito", "Personnalisation à l'infini"],
    ["Nuestros Servicios", "Nos services"],
    ["Nuestros Services", "Nos services"],
    ["Nuestro Services", "Nos services"],
    ["Nuestras Sucursales", "Nos salons"],
    ["Nuestras Salons", "Nos salons"],
    ["Sucursales en México", "Nos salons au Mexique"],
    ["Salons en México", "Nos salons au Mexique"],
    ["Acerca de Nosotros", "À propos"],
    ["Conócenos", "Nous découvrir"],
    ["Citas", "Rendez-vous"],
    ["Agenda tu Cita", "Prenez rendez-vous"],
    ["Haz tu Cita por WhatsApp ahora", "Prenez rendez-vous sur WhatsApp maintenant"],
    ["Aviso de Privacidad", "Politique de confidentialité"],
    ["Redes Sociales", "Réseaux sociaux"],
    ["Mas notas", "Plus d'articles"],
    ["Más notas", "Plus d'articles"],
    ["Buscar", "Rechercher"],
    ["CONTACTO", "CONTACT"],
    ["SUCURSALES", "SALONS"],
    ["SERVICIOS", "SERVICES"],
    ["Servicios", "Services"],
    ["Sucursales", "Salons"],
    ["Nosotros", "À propos"],
    ["Colecciones", "Collections"],
    ["Contacto", "Contact"],
    ["Envíanos un mensaje", "Envoyez-nous un message"],
    ["Datos de contacto", "Coordonnées"],
    ["Sucursal Santa Fe", "Salon Santa Fe"],
    ["Sucursal Polanco", "Salon Polanco"],
    ["Nombre*", "Nom*"],
    ["Teléfono / WhatsApp*", "Téléphone / WhatsApp*"],
    ["Nombre", "Nom"],
    ["Teléfono / WhatsApp", "Téléphone / WhatsApp"],
    ["Mensaje", "Message"],
    ["Enviar mensaje", "Envoyer le message"],
    ["Cortes", "Coupes"],
    ["Corte Dama", "Coupe Femme"],
    ["Corte Caballero", "Coupe Homme"],
    ["Director Artístico Dama", "Directeur artistique Femme"],
    ["Director Artístico Caballero", "Directeur artistique Homme"],
    ["Peinado", "Coiffure"],
    ["Peinado Corto", "Coiffure courte"],
    ["Peinado Mediano", "Coiffure mi-longue"],
    ["peinado Largo", "Coiffure longue"],
    ["Peinado Extra Largo", "Coiffure extra longue"],
    ["Peinado Recogido", "Coiffure attachée"],
    ["Extra Largo", "extra long"],
    ["Recogido", "attachée"],
    ["con Gel", "gel"],
    ["Nota: el precio puede variar por tipo de peinado, largo y densidad de cabello.", "Note : le prix peut varier selon le type de coiffure, la longueur et la densité des cheveux."],
    ["Manicure y Pedicure", "Manucure et pédicure"],
    ["Manicure Normal", "Manucure classique"],
    ["Manicure con Gel", "Manucure avec gel"],
    ["Manicure Spa", "Manucure spa"],
    ["Pedicura", "Pédicure"],
    ["Pedicura con Gel", "Pédicure avec gel"],
    ["Pedicura Spa", "Pédicure spa"],
    ["Cambio de Esmalte", "Changement de vernis"],
    ["Remover Gel", "Retrait du gel"],
    ["Remover Set Acrílico", "Retrait du set acrylique"],
    ["Set de Uñas de Acrílico", "Pose complète acrylique"],
    ["Parche de Uña", "Réparation d'ongle"],
    ["Uña de Arcílico (c/u)", "Ongle acrylique (unité)"],
    ["Barbería", "Barbier"],
    ["Bigote", "Moustache"],
    ["Media Barba", "Demi-barbe"],
    ["Jean Louis David México", "Jean Louis David Mexique"],
    ["Conoce más", "En savoir plus"],
    ["Un Legado de Innovación y Pasión", "Un héritage d'innovation et de passion"],
    ["Jean Louis David en el Mundo", "Jean Louis David dans le monde"],
    ["Aspectos de la Colección", "Aperçus de la collection"],
    ["Looks de la Colección &#8211; Primavera Verano 2024", "Aperçus de la collection Printemps-Été 2024"],
    ["Looks de la colección Primavera-Verano 2023", "Aperçus de la collection Printemps-Été 2023"],
    ["¡Adopta el bob (cuadrado), EL corte de moda de la temporada!", "Adoptez le carré, LA coupe tendance de la saison !"],
    ["Mixlight, la técnica emblemática de Jean Louis David para iluminar el cabello", "Mixlight, la technique emblématique de Jean Louis David pour illuminer les cheveux"],
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
      [
        "Desde su fundación en 1961 en la icónica Avenida de Wagram en París, Jean Louis David ha sido sinónimo de innovación, elegancia y vanguardia en el mundo de la belleza. Con una visión única y una pasión por destacar la belleza femenina, Jean Louis David transformó el peinado en un arte que evoluciona constantemente, adaptándose a los gustos y deseos de cada época.",
        "Since its founding in 1961 on the iconic Avenue de Wagram in Paris, Jean Louis David has stood for innovation, elegance, and avant-garde beauty. With a unique vision and a passion for highlighting feminine beauty, Jean Louis David turned hairstyling into an art that constantly evolves with the tastes and desires of each era.",
      ],
      [
        "Con su espíritu visionario, Jean Louis David revolucionó la peluquería en los años 70, creando técnicas y estilos que liberaron a las mujeres de los cortes rígidos. Su famoso corte escalado, introducido por primera vez en 1970, rompió con las normas establecidas y sigue siendo un ícono hasta hoy. Pero su legado va más allá de la técnica: Jean Louis David entendió que la belleza es una expresión personal, y dedicó su vida a ofrecer a las mujeres estilos modernos, versátiles y fáciles de llevar.",
        "With his visionary spirit, Jean Louis David revolutionized hairdressing in the 1970s, creating techniques and styles that freed women from rigid cuts. His famous layered cut, introduced in 1970, broke established rules and remains iconic today. But his legacy goes beyond technique: Jean Louis David understood that beauty is personal expression, and he dedicated his life to offering modern, versatile, easy-to-wear styles.",
      ],
      [
        "<strong>Jean Louis David</strong>, un visionario del estilismo y cortes de cabello, abrió su primer salón en París en 1961, revolucionando el mundo de la belleza con técnicas innovadoras y un enfoque único hacia la feminidad. Inspirado por los grandes fotógrafos de los años 60, Jean Louis David convirtió el peinado en un arte, rompiendo con las convenciones de la época. Hoy en día, su legado sigue vivo a través de un equipo artístico que continúa reinventando cortes, colores y peinados para mujeres en todo el mundo.",
        "<strong>Jean Louis David</strong>, a visionary in hairstyling and haircut design, opened his first salon in Paris in 1961, transforming the beauty world with innovative techniques and a unique approach to femininity. Inspired by leading photographers of the 1960s, Jean Louis David turned hairstyling into an art, breaking with the conventions of the time. Today, his legacy lives on through an artistic team that keeps reinventing cuts, colors, and styles for women around the world.",
      ],
      [
        "Para que cada corte sea único, la visita al salón empieza siempre con un intercambio individual y personalizado, llamado <strong>Momento Colección</strong>: seleccionar los cortes preferidos en los books exclusivos de los salones Jean Louis David e intercambiar opiniones con el peluquero para saber si se puede realizar o no ese corte en función del tipo de pelo o del estilo particular de cada una. Y para garantizar una calidad irreprochable, los salones Jean Louis David trabajan exclusivamente con los productos L’Oréal Professionnel, Kérastase et Redken.",
        "To make each haircut unique, every salon visit begins with an individual and personalized consultation called <strong>Collection Moment</strong>: selecting preferred cuts from Jean Louis David salon books and discussing with the stylist whether that cut can be achieved according to hair type and personal style. To ensure impeccable quality, Jean Louis David salons work exclusively with L&#39;Oréal Professionnel, Kérastase, and Redken products.",
      ],
      [
        "Con más de 1,000 salones en todo el mundo, Jean Louis David es una marca de referencia en salones de belleza. En México, contamos con dos sucursales en en Polanco y Santa Fe. Cada salón mantiene la esencia de nuestra marca, adaptando las tendencias globales al estilo y necesidades de nuestras clientas locales.",
        "With more than 1,000 salons worldwide, Jean Louis David is a benchmark beauty-salon brand. In Mexico, we have two locations in Polanco and Santa Fe. Each salon preserves the essence of our brand while adapting global trends to the style and needs of our local clients.",
      ],
      [
        "Nuestro compromiso es ofrecer cortes y colores que no solo luzcan espectaculares, sino que también sean fáciles de mantener en casa. Nos dedicamos a crear estilos que perduren y resalten lo mejor de cada visitante, con el toque audaz y moderno que caracteriza a nuestros salones.",
        "Our commitment is to offer cuts and colors that not only look spectacular, but are also easy to maintain at home. We create styles that last and highlight the best of every visitor, with the bold, modern touch that defines our salons.",
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
        "A wave of boldness announces spring. A breath of freedom defines summer. This is Jean Louis David&#39;s mood for the warm season.",
      ],
      [
        "Continuando con la temporada anterior, los cortes y colores inspirados en el underground te invitan a cambiar los códigos, a inventar tus propias reglas y a destacar entre la multitud.",
        "Continuing from last season, underground-inspired cuts and colors invite you to break the rules, create your own codes, and stand out from the crowd.",
      ],
      [
        "Celebrar la personalidad de cada uno, a través del cabello que a veces se expresa tanto como las palabras",
        "Celebrating each person's individuality through hair that sometimes speaks as loudly as words",
      ],
      [
        "Una declaración de cabello posible gracias al vanguardismo de los estilistas de Jean Louis David, con inspiraciones constantemente renovadas. Aquí, la arquitectura brutalista y el radicalismo urbano sirven como patio de recreo",
        "A hair statement made possible by the avant-garde vision of Jean Louis David stylists, fueled by constantly renewed inspiration. Here, brutalist architecture and urban radicalism become a playground",
      ],
      [
        "para las almas rebeldes.",
        "for rebellious souls.",
      ],
      [
        "SÉ TÚ MISMO, AFÍRATE, ATRÉVETE.",
        "BE YOURSELF, STAND TALL, DARE.",
      ],
    ],
    "/privacidad/": [
      ["<strong>RESPONSABLE</strong>", "<strong>DATA CONTROLLER</strong>"],
      ["DATOS PERSONALES", "PERSONAL DATA"],
      ["QUÉ SON LOS COOKIES Y CÓMO SE UTILIZAN", "WHAT COOKIES ARE AND HOW WE USE THEM"],
      ["USO DE LA INFORMACIÓN", "USE OF INFORMATION"],
      [
        "LIMITACIÓN DE USO Y DIVULGACIÓN DE LA INFORMACIÓN",
        "LIMITATION OF USE AND DISCLOSURE OF INFORMATION",
      ],
      [
        "TRANSFERENCIAS DE INFORMACIÓN CON TERCEROS",
        "DATA TRANSFERS TO THIRD PARTIES",
      ],
      ["PROTECCIÓN", "SECURITY"],
      ["CAMBIOS EN EL AVISO DE PRIVACIDAD", "CHANGES TO THE PRIVACY NOTICE"],
      [
        "En cumplimiento a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, la empresa COMERCIALIZADORA E IMPORTADORA DE SERVICIOS ALEBERTH es responsable de sus datos personales. El &#8220;Usuario&#8221; podrá contactar a la empresa en cualquier momento a través de nuestro correo electrónico contacto@jeanlouisdavid.com.mx o directamente en nuestra tienda, Juan Salvador Agraz 15, Local 201A , Col. Santa Fe, Cuajimalpa de Morelos, Ciudad de México.",
        "In compliance with the Federal Law on Protection of Personal Data Held by Private Parties, COMERCIALIZADORA E IMPORTADORA DE SERVIC&#73;OS ALEBERTH is responsible for your personal data. The &#8220;User&#8221; may contact the company at any time through our email contacto@jeanlouisdavid.com.mx or directly at our salon, Juan Salvador Agraz 15, Local 201A, Col. Santa Fe, Cuajimalpa de Morelos, Mexico City.",
      ],
      [
        "Protegemos y salvaguardamos sus datos personales para evitar el daño, pérdida, destrucción, robo, extravío, alteración, así como el tratamiento no autorizado de sus datos personales.",
        "We protect and safeguard your personal data to prevent damage, loss, destruction, theft, misplacement, alteration, and any unauthorized processing of your personal data.",
      ],
      [
        "La información deberá ser veraz y completa. El usuario responderá en todo momento por los datos proporcionados y en ningún caso la empresa será responsable de la veracidad de los mismos.",
        "Information must be true and complete. The user is always responsible for the data provided, and under no circumstances will the company be responsible for its accuracy.",
      ],
      [
        "La información solicitada al usuario en el sitio web de la empresa, será entra otra: Nombre completo. Teléfonos. Dirección Postal. Mail. Datos de Facturación. Datos de Tarjeta de Crédito. Sus datos personales serán tratados con base a en los principios de licitud, consentimiento, información, calidad, finalidad, lealtad, proporcionalidad y responsabilidad en términos de la Legislación. Se mantendrá la confidencialidad de sus datos personales estableciendo y manteniendo de forma efectiva las medidas de seguridad administrativas, técnicas y físicas, para evitar su daño, pérdida, alteración, destrucción, uso, acceso o divulgación indebida.",
        "The information requested from the user on the company website includes, among others: Full name, phone numbers, mailing address, email, billing details, and credit card data. Your personal data will be processed according to the principles of lawfulness, consent, information, quality, purpose, loyalty, proportionality, and accountability, in accordance with applicable legislation. The confidentiality of your personal data will be maintained through effective administrative, technical, and physical security measures to prevent damage, loss, alteration, destruction, improper use, access, or disclosure.",
      ],
      [
        "La aceptación de las cookies no es un requisito para visitar nuestra página. Las cookies son pequeños archivos de texto que identifican a tu computadora con nuestro servidor como un usuario único cuando tú visitas ciertas páginas en nuestro sitio y que son guardados por tu navegador de internet en el disco duro de tu computadora. Las cookies se pueden utilizar para reconocer tu dirección de protocolo de internet, que te ahorra tiempo mientras quieres entrar a nuestro sitio. Sólo utilizamos cookies para tu comodidad. Tu navegador puede ser configurado para no aceptar cookies, pero esto sería restringir el uso de nuestra página. Por favor, acepta nuestra garantía de que el uso de cookies no contiene datos de carácter personal o privado, y están libres de virus. Si deseas obtener más información acerca de las cookies, ve a http://www.allaboutcookies.org, y para obtener información sobre la eliminación de ellos desde el navegador, ve a http://www.allaboutcookies.org/manage-cookies/index.html. En el caso de empleo de cookies, el botón de &#8220;ayuda&#8221; que se encuentra en la barra de herramientas de la mayoría de los navegadores, le dirá cómo evitar aceptar nuevos cookies, cómo hacer que el navegador le notifique cuando recibe un nuevo cookie o cómo deshabilitar todos los cookies.",
        "Accepting cookies is not required to visit our website. Cookies are small text files that identify your computer to our server as a unique user when you visit certain pages on our site, and they are stored by your browser on your computer&#39;s hard drive. Cookies may be used to recognize your internet protocol address, which saves time when entering our website. We use cookies only for your convenience. Your browser can be configured to reject cookies, but this may restrict the use of our website. Please note that cookies do not contain personal or private data and are virus-free. For more information about cookies, visit http://www.allaboutcookies.org, and for information on deleting them from your browser, visit http://www.allaboutcookies.org/manage-cookies/index.html. If cookies are used, the &#8220;help&#8221; button in most browsers&#39; toolbar will tell you how to prevent new cookies, how to receive notifications when you get a new cookie, or how to disable all cookies.",
      ],
      [
        "La información solicitada permite a la empresa contactar a los usuarios y potenciales clientes cuando sea necesario para completar los procedimientos de compra. Así mismo la empresa utilizará la información obtenida para:",
        "The information requested allows the company to contact users and potential clients when necessary to complete purchasing procedures. The company will also use the information obtained to:",
      ],
      ["Procurar un servicio eficiente", "Provide efficient service"],
      [
        "Informar sobre nuevos productos o servicios que estén relacionados con el contratado o adquirido por el cliente",
        "Inform you about new products or services related to those contracted or acquired by the client",
      ],
      [
        "Dar cumplimiento a obligaciones contraídas con nuestros clientes",
        "Comply with obligations undertaken with our clients",
      ],
      [
        "Informar sobre cambios de nuestros productos o servicios",
        "Inform you about changes to our products or services",
      ],
      ["Proveer una mejor atención al usuario.", "Provide better customer service."],
      [
        "Los datos personales o empresariales proporcionados por el usuario formarán parte de un archivo que contendrá su perfil. El usuario puede modificar su perfil en cualquier momento utilizando su número de usuario y contraseña.",
        "The personal or business data provided by the user will become part of a file containing their profile. The user may modify their profile at any time using their username and password.",
      ],
      [
        "En nuestro programa de notificación de promociones, ofertas y servicios a través de correo electrónico, sólo la empresa tiene acceso a la información recabada. Este tipo de publicidad se realiza mediante avisos y mensajes promocionales de correo electrónico, los cuales sólo serán enviados a usted y a aquellos contactos registrados para tal propósito, esta indicación podrá usted modificarla en cualquier momento enviando un correo a contacto@jeanlouisdavid.com.mx. En los correos electrónicos enviados, pueden incluirse ocasionalmente ofertas de terceras partes que sean nuestros socios comerciales.",
        "In our promotions, offers, and services notification program via email, only the company has access to the collected information. This type of advertising is carried out through notices and promotional email messages, which will only be sent to you and to contacts registered for that purpose. You may change this preference at any time by sending an email to contacto@jeanlouisdavid.com.mx. Emails sent may occasionally include offers from third parties that are our business partners.",
      ],
      [
        "La empresa únicamente realiza remisiones de datos para cumplir con las obligaciones contraídas con los clientes. La empresa solo compartirá datos cuando haya sido requerido por orden judicial para cumplir con las disposiciones procesales.",
        "The company only transfers data to fulfill obligations undertaken with clients. The company will share data only when required by court order to comply with legal procedural provisions.",
      ],
      [
        "Al momento de comprar un producto en línea, se pedirán datos bancarios para los cuales le ofrecemos seguridad y confidencialidad de los datos que proporciona. Sin embargo, y a pesar de contar cada día con herramientas más seguras, la protección de los datos enviados a través de Internet no se puede garantizar al 100%; por lo que una vez recibidos, se hará todo lo posible por salvaguardar la información.",
        "When purchasing a product online, banking data will be requested, and we offer security and confidentiality for the information you provide. However, despite increasingly secure tools, protection of data sent over the Internet cannot be guaranteed 100%; therefore, once received, every possible measure will be taken to safeguard the information.",
      ],
      [
        "Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad, para la atención de novedades legislativas o jurisprudenciales, políticas internas, nuevos requerimientos para la prestación u ofrecimiento de nuestros servicios o productos y prácticas del mercado. Estas modificaciones estarán disponibles al público a través de nuestra página de Internet sección aviso de privacidad.",
        "We reserve the right to make modifications or updates to this privacy notice at any time in response to legislative or case-law developments, internal policies, new requirements for providing or offering our services or products, and market practices. These changes will be made available to the public through the privacy notice section on our website.",
      ],
    ],
  },
  fr: {
    "/": [
      [
        "Descubre la Experiencia Jean Louis David: Innovación y Elegancia en Cada Estilo",
        "Découvrez l'expérience Jean Louis David : innovation et élégance dans chaque style",
      ],
      [
        "En Jean Louis David, no solo creamos estilos, creamos experiencias. Nuestra pasión es redefinir el arte de la belleza capilar, fusionando innovación, sofisticación y un enfoque personalizado. Cada visita a nuestros salones es una oportunidad para descubrir una nueva versión de ti, guiado por nuestros expertos estilistas que combinan las últimas tendencias con técnicas exclusivas.",
        "Chez Jean Louis David, nous ne créons pas seulement des styles, nous créons des expériences. Notre passion est de réinventer l'art de la beauté capillaire en associant innovation, sophistication et approche personnalisée. Chaque visite est l'occasion de découvrir une nouvelle version de vous-même, guidée par nos stylistes experts.",
      ],
      [
        "Estamos aquí para hacerte sentir y verte espectacular.",
        "Nous sommes là pour vous faire sentir et paraître spectaculaire.",
      ],
    ],
    "/servicios/": [
      [
        "En Jean Louis David, ofrecemos una selección de servicios de para realzar tu belleza. Nuestros expertos están listos para brindarte cortes, peinados, barbería y tratamientos para manos y pies con la máxima atención al detalle. Descubre la diferencia en cada visita.",
        "Chez Jean Louis David, nous proposons une sélection de services pour sublimer votre beauté. Nos experts réalisent coupes, coiffures, services barbier et soins des mains et des pieds avec une attention maximale aux détails. Découvrez la différence à chaque visite.",
      ],
    ],
    "/sucursales/": [
      [
        "Encuentra tu salón Jean Louis David más cercano y vive una experiencia de belleza exclusiva. Visítanos en nuestras sucursales y disfruta del mejor cuidado capilar y estilismo con un enfoque personalizado y la excelencia que nos distingue.",
        "Trouvez le salon Jean Louis David le plus proche et vivez une expérience beauté exclusive. Visitez nos salons et profitez des meilleurs soins capillaires et du stylisme avec une approche personnalisée et l'excellence qui nous distingue.",
      ],
    ],
    "/nosotros/": [
      [
        "Jean Louis David: Innovación y Estilo que Trasciende",
        "Jean Louis David : innovation et style qui traversent le temps",
      ],
      [
        "Desde 1961, Jean Louis David ha transformado el estilismo en un arte, siempre un paso adelante en la evolución de los gustos y deseos de nuestros clientes. Nuestra misión es hacer que cada visita a nuestros salones sea una experiencia de belleza única y personalizada.",
        "Depuis 1961, Jean Louis David a transformé la coiffure en art, toujours un pas en avance sur l'évolution des envies de ses clients. Notre mission est de faire de chaque visite une expérience beauté unique et personnalisée.",
      ],
      [
        "Un Legado de Innovación y Pasión",
        "Un héritage d'innovation et de passion",
      ],
      [
        "Personalización Hasta el Infinito",
        "Personnalisation à l'infini",
      ],
      [
        "Desde su fundación en 1961 en la icónica Avenida de Wagram en París, Jean Louis David ha sido sinónimo de innovación, elegancia y vanguardia en el mundo de la belleza. Con una visión única y una pasión por destacar la belleza femenina, Jean Louis David transformó el peinado en un arte que evoluciona constantemente, adaptándose a los gustos y deseos de cada época.",
        "Depuis sa fondation en 1961 sur l'emblématique avenue de Wagram à Paris, Jean Louis David est synonyme d'innovation, d'élégance et d'avant-garde dans l'univers de la beauté. Avec une vision unique et une passion pour révéler la beauté féminine, Jean Louis David a transformé la coiffure en un art en évolution constante, adapté aux goûts et aux envies de chaque époque.",
      ],
      [
        "Con su espíritu visionario, Jean Louis David revolucionó la peluquería en los años 70, creando técnicas y estilos que liberaron a las mujeres de los cortes rígidos. Su famoso corte escalado, introducido por primera vez en 1970, rompió con las normas establecidas y sigue siendo un ícono hasta hoy. Pero su legado va más allá de la técnica: Jean Louis David entendió que la belleza es una expresión personal, y dedicó su vida a ofrecer a las mujeres estilos modernos, versátiles y fáciles de llevar.",
        "Avec son esprit visionnaire, Jean Louis David a révolutionné la coiffure dans les années 1970, en créant des techniques et des styles qui ont libéré les femmes des coupes rigides. Sa célèbre coupe dégradée, introduite pour la première fois en 1970, a brisé les codes établis et reste iconique aujourd'hui. Mais son héritage va au-delà de la technique : Jean Louis David a compris que la beauté est une expression personnelle, et il a consacré sa vie à proposer aux femmes des styles modernes, polyvalents et faciles à porter.",
      ],
      [
        "<strong>Jean Louis David</strong>, un visionario del estilismo y cortes de cabello, abrió su primer salón en París en 1961, revolucionando el mundo de la belleza con técnicas innovadoras y un enfoque único hacia la feminidad. Inspirado por los grandes fotógrafos de los años 60, Jean Louis David convirtió el peinado en un arte, rompiendo con las convenciones de la época. Hoy en día, su legado sigue vivo a través de un equipo artístico que continúa reinventando cortes, colores y peinados para mujeres en todo el mundo.",
        "<strong>Jean Louis David</strong>, visionnaire du stylisme et de la coupe, a ouvert son premier salon à Paris en 1961, révolutionnant le monde de la beauté avec des techniques innovantes et une approche unique de la féminité. Inspiré par les grands photographes des années 1960, Jean Louis David a fait de la coiffure un art, en rompant avec les conventions de l'époque. Aujourd'hui, son héritage continue de vivre grâce à une équipe artistique qui réinvente sans cesse coupes, couleurs et coiffures pour les femmes du monde entier.",
      ],
      [
        "Para que cada corte sea único, la visita al salón empieza siempre con un intercambio individual y personalizado, llamado <strong>Momento Colección</strong>: seleccionar los cortes preferidos en los books exclusivos de los salones Jean Louis David e intercambiar opiniones con el peluquero para saber si se puede realizar o no ese corte en función del tipo de pelo o del estilo particular de cada una. Y para garantizar una calidad irreprochable, los salones Jean Louis David trabajan exclusivamente con los productos L’Oréal Professionnel, Kérastase et Redken.",
        "Pour que chaque coupe soit unique, la visite au salon commence toujours par un échange individuel et personnalisé, appelé <strong>Moment Collection</strong> : sélectionner les coupes préférées dans les books exclusifs des salons Jean Louis David et échanger avec le coiffeur pour savoir si la coupe peut être réalisée selon le type de cheveux et le style propre à chacune. Et pour garantir une qualité irréprochable, les salons Jean Louis David travaillent exclusivement avec les produits L&#39;Oréal Professionnel, Kérastase et Redken.",
      ],
      [
        "Con más de 1,000 salones en todo el mundo, Jean Louis David es una marca de referencia en salones de belleza. En México, contamos con dos sucursales en en Polanco y Santa Fe. Cada salón mantiene la esencia de nuestra marca, adaptando las tendencias globales al estilo y necesidades de nuestras clientas locales.",
        "Avec plus de 1 000 salons dans le monde, Jean Louis David est une marque de référence dans l'univers de la coiffure. Au Mexique, nous comptons deux salons, à Polanco et à Santa Fe. Chaque salon préserve l'essence de notre marque tout en adaptant les tendances mondiales au style et aux besoins de notre clientèle locale.",
      ],
      [
        "Nuestro compromiso es ofrecer cortes y colores que no solo luzcan espectaculares, sino que también sean fáciles de mantener en casa. Nos dedicamos a crear estilos que perduren y resalten lo mejor de cada visitante, con el toque audaz y moderno que caracteriza a nuestros salones.",
        "Notre engagement est de proposer des coupes et des couleurs qui ne sont pas seulement spectaculaires, mais aussi faciles à entretenir à la maison. Nous créons des styles durables qui révèlent le meilleur de chaque visiteur, avec la touche audacieuse et moderne qui caractérise nos salons.",
      ],
    ],
    "/contacto/": [
      [
        "¿Deseas más información sobre nuestros servicios? No dudes en contactarnos, nuestro equipo en Jean Louis David estará encantado de asistirte.",
        "Vous souhaitez plus d'informations sur nos services ? N'hésitez pas à nous contacter, l'équipe Jean Louis David sera ravie de vous accompagner.",
      ],
    ],
    "/colecciones/": [
      [
        "Un viento de audacia anuncia la primavera. Un soplo de libertad caracteriza el verano. Este es el humor de Jean Louis David para la estación cálida.",
        "Un vent d'audace annonce le printemps. Un souffle de liberté caractérise l'été. C'est l'esprit Jean Louis David pour la belle saison.",
      ],
      [
        "Continuando con la temporada anterior, los cortes y colores inspirados en el underground te invitan a cambiar los códigos, a inventar tus propias reglas y a destacar entre la multitud.",
        "Dans la continuité de la saison précédente, les coupes et couleurs inspirées de l'underground vous invitent à bousculer les codes, à inventer vos propres règles et à sortir du lot.",
      ],
      [
        "Celebrar la personalidad de cada uno, a través del cabello que a veces se expresa tanto como las palabras",
        "Célébrer la personnalité de chacun, à travers des cheveux qui s'expriment parfois autant que les mots",
      ],
      [
        "Una declaración de cabello posible gracias al vanguardismo de los estilistas de Jean Louis David, con inspiraciones constantemente renovadas. Aquí, la arquitectura brutalista y el radicalismo urbano sirven como patio de recreo",
        "Une expression capillaire rendue possible grâce à l'avant-gardisme des stylistes Jean Louis David, nourrie par des inspirations constamment renouvelées. Ici, l'architecture brutaliste et le radicalisme urbain servent de terrain de jeu",
      ],
      [
        "para las almas rebeldes.",
        "pour les âmes rebelles.",
      ],
      [
        "SÉ TÚ MISMO, AFÍRATE, ATRÉVETE.",
        "SOYEZ VOUS-MÊME, AFFIRMEZ-VOUS, OSEZ.",
      ],
    ],
    "/privacidad/": [
      ["<strong>RESPONSABLE</strong>", "<strong>RESPONSABLE DU TRAITEMENT</strong>"],
      ["DATOS PERSONALES", "DONNÉES PERSONNELLES"],
      [
        "QUÉ SON LOS COOKIES Y CÓMO SE UTILIZAN",
        "QUE SONT LES COOKIES ET COMMENT ILS SONT UTILISÉS",
      ],
      ["USO DE LA INFORMACIÓN", "UTILISATION DES INFORMATIONS"],
      [
        "LIMITACIÓN DE USO Y DIVULGACIÓN DE LA INFORMACIÓN",
        "LIMITATION DE L&#39;UTILISATION ET DE LA DIVULGATION DES INFORMATIONS",
      ],
      [
        "TRANSFERENCIAS DE INFORMACIÓN CON TERCEROS",
        "TRANSFERTS D&#39;INFORMATIONS À DES TIERS",
      ],
      ["PROTECCIÓN", "PROTECTION"],
      [
        "CAMBIOS EN EL AVISO DE PRIVACIDAD",
        "MODIFICATIONS DE LA POLITIQUE DE CONFIDENTIALITÉ",
      ],
      [
        "En cumplimiento a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, la empresa COMERCIALIZADORA E IMPORTADORA DE SERVICIOS ALEBERTH es responsable de sus datos personales. El &#8220;Usuario&#8221; podrá contactar a la empresa en cualquier momento a través de nuestro correo electrónico contacto@jeanlouisdavid.com.mx o directamente en nuestra tienda, Juan Salvador Agraz 15, Local 201A , Col. Santa Fe, Cuajimalpa de Morelos, Ciudad de México.",
        "Conformément à la Loi fédérale sur la protection des données personnelles détenues par des particuliers, la société COMERCIALIZADORA E IMPORTADORA DE SERVIC&#73;OS ALEBERTH est responsable de vos données personnelles. L&#8220;Utilisateur&#8221; peut contacter la société à tout moment via notre e-mail contacto@jeanlouisdavid.com.mx ou directement dans notre salon, Juan Salvador Agraz 15, Local 201A, Col. Santa Fe, Cuajimalpa de Morelos, Ciudad de México.",
      ],
      [
        "Protegemos y salvaguardamos sus datos personales para evitar el daño, pérdida, destrucción, robo, extravío, alteración, así como el tratamiento no autorizado de sus datos personales.",
        "Nous protégeons et préservons vos données personnelles afin d&#39;éviter tout dommage, perte, destruction, vol, égarement, altération, ainsi que tout traitement non autorisé de vos données personnelles.",
      ],
      [
        "La información deberá ser veraz y completa. El usuario responderá en todo momento por los datos proporcionados y en ningún caso la empresa será responsable de la veracidad de los mismos.",
        "Les informations fournies doivent être exactes et complètes. L&#39;utilisateur est à tout moment responsable des données fournies et la société ne pourra en aucun cas être tenue responsable de leur exactitude.",
      ],
      [
        "La información solicitada al usuario en el sitio web de la empresa, será entra otra: Nombre completo. Teléfonos. Dirección Postal. Mail. Datos de Facturación. Datos de Tarjeta de Crédito. Sus datos personales serán tratados con base a en los principios de licitud, consentimiento, información, calidad, finalidad, lealtad, proporcionalidad y responsabilidad en términos de la Legislación. Se mantendrá la confidencialidad de sus datos personales estableciendo y manteniendo de forma efectiva las medidas de seguridad administrativas, técnicas y físicas, para evitar su daño, pérdida, alteración, destrucción, uso, acceso o divulgación indebida.",
        "Les informations demandées à l&#39;utilisateur sur le site web de la société comprennent notamment : nom complet, numéros de téléphone, adresse postale, e-mail, données de facturation et données de carte bancaire. Vos données personnelles seront traitées selon les principes de licéité, de consentement, d&#39;information, de qualité, de finalité, de loyauté, de proportionnalité et de responsabilité, conformément à la législation applicable. La confidentialité de vos données personnelles sera maintenue au moyen de mesures de sécurité administratives, techniques et physiques effectives, afin d&#39;éviter tout dommage, perte, altération, destruction, usage, accès ou divulgation indue.",
      ],
      [
        "La aceptación de las cookies no es un requisito para visitar nuestra página. Las cookies son pequeños archivos de texto que identifican a tu computadora con nuestro servidor como un usuario único cuando tú visitas ciertas páginas en nuestro sitio y que son guardados por tu navegador de internet en el disco duro de tu computadora. Las cookies se pueden utilizar para reconocer tu dirección de protocolo de internet, que te ahorra tiempo mientras quieres entrar a nuestro sitio. Sólo utilizamos cookies para tu comodidad. Tu navegador puede ser configurado para no aceptar cookies, pero esto sería restringir el uso de nuestra página. Por favor, acepta nuestra garantía de que el uso de cookies no contiene datos de carácter personal o privado, y están libres de virus. Si deseas obtener más información acerca de las cookies, ve a http://www.allaboutcookies.org, y para obtener información sobre la eliminación de ellos desde el navegador, ve a http://www.allaboutcookies.org/manage-cookies/index.html. En el caso de empleo de cookies, el botón de &#8220;ayuda&#8221; que se encuentra en la barra de herramientas de la mayoría de los navegadores, le dirá cómo evitar aceptar nuevos cookies, cómo hacer que el navegador le notifique cuando recibe un nuevo cookie o cómo deshabilitar todos los cookies.",
        "L&#39;acceptation des cookies n&#39;est pas une condition pour visiter notre site. Les cookies sont de petits fichiers texte qui identifient votre ordinateur auprès de notre serveur comme un utilisateur unique lorsque vous consultez certaines pages de notre site, et qui sont enregistrés par votre navigateur sur le disque dur de votre ordinateur. Les cookies peuvent être utilisés pour reconnaître votre adresse de protocole Internet, ce qui vous fait gagner du temps lors de votre accès à notre site. Nous utilisons les cookies uniquement pour votre confort. Votre navigateur peut être configuré pour refuser les cookies, mais cela peut limiter l&#39;utilisation de notre site. Veuillez noter que l&#39;utilisation des cookies ne contient pas de données personnelles ou privées et qu&#39;ils sont exempts de virus. Si vous souhaitez en savoir plus sur les cookies, consultez http://www.allaboutcookies.org, et pour savoir comment les supprimer depuis votre navigateur, consultez http://www.allaboutcookies.org/manage-cookies/index.html. En cas d&#39;utilisation de cookies, le bouton &#8220;aide&#8221; situé dans la barre d&#39;outils de la plupart des navigateurs vous indiquera comment empêcher l&#39;acceptation de nouveaux cookies, comment être averti lors de la réception d&#39;un nouveau cookie, ou comment désactiver tous les cookies.",
      ],
      [
        "La información solicitada permite a la empresa contactar a los usuarios y potenciales clientes cuando sea necesario para completar los procedimientos de compra. Así mismo la empresa utilizará la información obtenida para:",
        "Les informations demandées permettent à la société de contacter les utilisateurs et les clients potentiels lorsque cela est nécessaire pour finaliser les procédures d&#39;achat. De même, la société utilisera les informations obtenues pour :",
      ],
      ["Procurar un servicio eficiente", "Assurer un service efficace"],
      [
        "Informar sobre nuevos productos o servicios que estén relacionados con el contratado o adquirido por el cliente",
        "Informer sur de nouveaux produits ou services liés à ceux contractés ou acquis par le client",
      ],
      [
        "Dar cumplimiento a obligaciones contraídas con nuestros clientes",
        "Respecter les obligations contractées envers nos clients",
      ],
      [
        "Informar sobre cambios de nuestros productos o servicios",
        "Informer des changements concernant nos produits ou services",
      ],
      ["Proveer una mejor atención al usuario.", "Offrir un meilleur accompagnement à l&#39;utilisateur."],
      [
        "Los datos personales o empresariales proporcionados por el usuario formarán parte de un archivo que contendrá su perfil. El usuario puede modificar su perfil en cualquier momento utilizando su número de usuario y contraseña.",
        "Les données personnelles ou professionnelles fournies par l&#39;utilisateur feront partie d&#39;un fichier contenant son profil. L&#39;utilisateur peut modifier son profil à tout moment en utilisant son identifiant et son mot de passe.",
      ],
      [
        "En nuestro programa de notificación de promociones, ofertas y servicios a través de correo electrónico, sólo la empresa tiene acceso a la información recabada. Este tipo de publicidad se realiza mediante avisos y mensajes promocionales de correo electrónico, los cuales sólo serán enviados a usted y a aquellos contactos registrados para tal propósito, esta indicación podrá usted modificarla en cualquier momento enviando un correo a contacto@jeanlouisdavid.com.mx. En los correos electrónicos enviados, pueden incluirse ocasionalmente ofertas de terceras partes que sean nuestros socios comerciales.",
        "Dans notre programme de notification des promotions, offres et services par e-mail, seule la société a accès aux informations collectées. Ce type de communication est réalisé au moyen d&#39;avis et de messages promotionnels envoyés par e-mail, qui seront adressés uniquement à vous et aux contacts enregistrés à cette fin. Vous pouvez modifier cette préférence à tout moment en envoyant un e-mail à contacto@jeanlouisdavid.com.mx. Les e-mails envoyés peuvent occasionnellement inclure des offres de tiers qui sont nos partenaires commerciaux.",
      ],
      [
        "La empresa únicamente realiza remisiones de datos para cumplir con las obligaciones contraídas con los clientes. La empresa solo compartirá datos cuando haya sido requerido por orden judicial para cumplir con las disposiciones procesales.",
        "La société effectue uniquement des transferts de données afin de respecter les obligations contractées envers ses clients. Elle ne partagera des données que lorsqu&#39;une décision judiciaire l&#39;exige pour se conformer aux dispositions procédurales.",
      ],
      [
        "Al momento de comprar un producto en línea, se pedirán datos bancarios para los cuales le ofrecemos seguridad y confidencialidad de los datos que proporciona. Sin embargo, y a pesar de contar cada día con herramientas más seguras, la protección de los datos enviados a través de Internet no se puede garantizar al 100%; por lo que una vez recibidos, se hará todo lo posible por salvaguardar la información.",
        "Lors de l&#39;achat d&#39;un produit en ligne, des données bancaires seront demandées, pour lesquelles nous assurons la sécurité et la confidentialité des informations fournies. Toutefois, malgré des outils chaque jour plus sûrs, la protection des données transmises via Internet ne peut pas être garantie à 100 % ; une fois reçues, toutes les mesures possibles seront prises pour protéger ces informations.",
      ],
      [
        "Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad, para la atención de novedades legislativas o jurisprudenciales, políticas internas, nuevos requerimientos para la prestación u ofrecimiento de nuestros servicios o productos y prácticas del mercado. Estas modificaciones estarán disponibles al público a través de nuestra página de Internet sección aviso de privacidad.",
        "Nous nous réservons le droit d&#39;apporter à tout moment des modifications ou des mises à jour à la présente politique de confidentialité, afin de tenir compte des évolutions législatives ou jurisprudentielles, des politiques internes, des nouvelles exigences pour la fourniture ou l&#39;offre de nos services ou produits, ainsi que des pratiques du marché. Ces modifications seront mises à la disposition du public sur la section politique de confidentialité de notre site Internet.",
      ],
    ],
  },
};

export function localizePageContent(markup: string, locale: Locale, route: string): string {
  if (locale === DEFAULT_LOCALE) return markup;

  const normalizedRoute = normalizeRoutePath(route);
  const commonReplacements = COMMON_TEXT_REPLACEMENTS[locale];
  const routeReplacements = ROUTE_TEXT_REPLACEMENTS[locale][normalizedRoute] ?? [];
  const privacyReplacements = ROUTE_TEXT_REPLACEMENTS[locale]["/privacidad/"] ?? [];
  const shouldUsePrivacyFallback =
    routeReplacements.length === 0 && /\/privacidad(?:\.html)?\/?$/i.test(normalizedRoute);
  const effectiveRouteReplacements = shouldUsePrivacyFallback
    ? privacyReplacements
    : routeReplacements;

  return applyReplacements(markup, [...effectiveRouteReplacements, ...commonReplacements]);
}
