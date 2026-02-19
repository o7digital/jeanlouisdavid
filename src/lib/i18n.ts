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
  return `/${route.replace(/^\/|\/$/g, "")}/`;
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
