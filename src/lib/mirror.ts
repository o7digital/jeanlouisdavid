import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export type MirroredPageDefinition = {
  route: string;
  sourceFile: string;
};

export type ParsedMirroredPage = {
  route: string;
  lang: string;
  htmlClass: string;
  bodyClass: string;
  headHtml: string;
  bodyHtml: string;
};

const MIRROR_ROOT = resolve(process.cwd(), "mirror");
const PUBLIC_ROOT = resolve(process.cwd(), "public");

export const MIRRORED_PAGES: ReadonlyArray<MirroredPageDefinition> = [
  { route: "/", sourceFile: "index.html" },
  { route: "/nosotros/", sourceFile: "nosotros/index.html" },
  { route: "/sucursales/", sourceFile: "sucursales/index.html" },
  { route: "/servicios/", sourceFile: "servicios/index.html" },
  { route: "/contacto/", sourceFile: "contacto/index.html" },
  { route: "/colecciones/", sourceFile: "colecciones/index.html" },
  { route: "/privacidad/", sourceFile: "privacidad.html" },
  {
    route: "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
    sourceFile: "adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/index.html",
  },
  {
    route: "/looks-de-la-coleccion-primavera-verano-2023/",
    sourceFile: "looks-de-la-coleccion-primavera-verano-2023/index.html",
  },
  {
    route: "/mixlight-la-tecnica-para-iluminar-el-cabello/",
    sourceFile: "mixlight-la-tecnica-para-iluminar-el-cabello/index.html",
  },
  {
    route: "/plurality-coleccion-primavera-verano-2024/",
    sourceFile: "plurality-coleccion-primavera-verano-2024/index.html",
  },
];

const WP_ID_TO_ROUTE = new Map<string, string>([
  ["16", "/"],
  ["59", "/nosotros/"],
  ["98", "/sucursales/"],
  ["135", "/servicios/"],
  ["150", "/contacto/"],
  ["164", "/colecciones/"],
  ["195", "/privacidad/"],
  ["28", "/plurality-coleccion-primavera-verano-2024/"],
  ["41", "/mixlight-la-tecnica-para-iluminar-el-cabello/"],
  ["44", "/looks-de-la-coleccion-primavera-verano-2023/"],
  ["52", "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/"],
]);

const DIRECT_FILE_LINKS = new Map<string, string>([
  ["privacidad.html", "/privacidad/"],
  ["nosotros/index.html", "/nosotros/"],
  ["sucursales/index.html", "/sucursales/"],
  ["servicios/index.html", "/servicios/"],
  ["contacto/index.html", "/contacto/"],
  ["colecciones/index.html", "/colecciones/"],
  [
    "adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/index.html",
    "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
  ],
  [
    "looks-de-la-coleccion-primavera-verano-2023/index.html",
    "/looks-de-la-coleccion-primavera-verano-2023/",
  ],
  [
    "mixlight-la-tecnica-para-iluminar-el-cabello/index.html",
    "/mixlight-la-tecnica-para-iluminar-el-cabello/",
  ],
  [
    "plurality-coleccion-primavera-verano-2024/index.html",
    "/plurality-coleccion-primavera-verano-2024/",
  ],
]);

const pageCache = new Map<string, ParsedMirroredPage>();
const localAssetCache = new Map<string, boolean>();

function extractAttribute(rawAttributes: string | undefined, attribute: string): string {
  if (!rawAttributes) return "";
  const match = rawAttributes.match(new RegExp(`${attribute}=(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? "";
}

function normalizeInternalLinks(markup: string): string {
  let normalized = markup;

  normalized = normalized.replace(/%3F/gi, "?");
  normalized = normalized.replace(/https?:\/\/(?:www\.)?jeanlouisdavid\.com\.mx\//gi, "/");
  normalized = normalized.replace(/https?:\/\/(?:www\.)?jeanlouisdavid\.com\.mx/gi, "");
  normalized = normalized.replace(/<link[^>]+rel=(["'])canonical\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(/<link[^>]+rel=(["'])shortlink\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(/<link[^>]+href=(["'])[^"']*wp-json[^"']*\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(/<link[^>]+rel=(["'])EditURI\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(/<link[^>]+rel=(["'])pingback\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(/<link[^>]+type=(["'])application\/rss\+xml\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(/<link[^>]+href=(["'])https:\/\/gmpg\.org\/xfn\/11\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(/<meta[^>]+name=(["'])description\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(/<meta[^>]+name=(["'])robots\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(/<meta[^>]+property=(["'])og:[^"']+\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(/<meta[^>]+name=(["'])twitter:[^"']+\1[^>]*>\s*/gi, "");
  normalized = normalized.replace(
    /<script[^>]+id=(["'])avia_google_recaptcha_front_script-js-extra\1[^>]*>[\s\S]*?<\/script>\s*/gi,
    "",
  );
  normalized = normalized.replace(
    /<script[^>]*(?:google\.com\/recaptcha|avia_google_recaptcha|recaptcha)[^>]*>[\s\S]*?<\/script>\s*/gi,
    "",
  );
  normalized = normalized.replace(
    /<div[^>]*class=(["'])[^"']*av-recaptcha-area[^"']*\1[^>]*>[\s\S]*?<\/div>\s*/gi,
    "",
  );
  normalized = normalized.replace(
    /<div[^>]*class=(["'])avia-disabled-form\1[^>]*>[\s\S]*?<\/div>\s*/gi,
    "",
  );
  normalized = normalized.replace(
    /\b(href|src|action|data-src|poster)=("|')(?!https?:|\/\/|\/|#|mailto:|tel:|javascript:|data:)((?:wp-content|wp-includes|wp-admin|wp-json|feed\/|xmlrpc\.php|favicon(?:\.|\/)|sitemap\.xml|robots\.txt)[^"']*)\2/gi,
    (_fullMatch: string, attribute: string, quote: string, value: string): string =>
      `${attribute}=${quote}/${value}${quote}`,
  );
  normalized = normalized.replace(
    /\bdata-srcset=(["'])([^"']+)\1/gi,
    (_fullMatch: string, quote: string, value: string): string => {
      const rewritten = value.replace(
        /(^|,\s*)(?!(?:https?:|\/\/|\/|data:))((?:wp-content|wp-includes)[^,\s]*)/gi,
        (_innerMatch, prefix: string, path: string): string => `${prefix}/${path}`,
      );

      return `data-srcset=${quote}${rewritten}${quote}`;
    },
  );
  normalized = normalized.replace(
    /\/wp-content\/uploads\/[A-Za-z0-9._%/-]+\.(?:png|jpe?g)(?:\?[^"'\s)>]*)?/gi,
    (assetPath: string): string => {
      const basePath = assetPath.split("?")[0];
      const webpPath = basePath.replace(/\.(png|jpe?g)$/i, ".webp");
      const cacheKey = webpPath.toLowerCase();
      const knownExists = localAssetCache.get(cacheKey);
      if (knownExists !== undefined) {
        return knownExists ? webpPath : basePath;
      }

      const absoluteCandidate = resolve(PUBLIC_ROOT, webpPath.replace(/^\/+/, ""));
      const webpExists = existsSync(absoluteCandidate);
      localAssetCache.set(cacheKey, webpExists);
      return webpExists ? webpPath : basePath;
    },
  );

  normalized = normalized.replace(
    /index\.html\?p=(\d+)(?:\.html)?/gi,
    (fullMatch, id: string): string => WP_ID_TO_ROUTE.get(id) ?? fullMatch,
  );
  normalized = normalized.replace(
    /\/\?p=(\d+)/gi,
    (fullMatch, id: string): string => WP_ID_TO_ROUTE.get(id) ?? fullMatch,
  );

  for (const [from, to] of DIRECT_FILE_LINKS.entries()) {
    normalized = normalized.split(from).join(to);
  }

  normalized = normalized.replace(/index\.html#top/gi, "/#top");
  normalized = normalized.replace(/\.css\?ver=[^"'\s>]+\.css/gi, ".css");
  normalized = normalized.replace(
    /\b(href|src|action|data-src|data-srcset)=("|')((?:\.\.\/)+)([^"']*)\2/gi,
    (_fullMatch, attribute: string, quote: string, _prefix: string, rest: string): string =>
      `${attribute}=${quote}/${rest.replace(/^\/+/, "")}${quote}`,
  );
  normalized = normalized.replace(
    /url\((['"]?)((?:\.\.\/)+)([^'")]+)\1\)/gi,
    (_fullMatch, quote: string, _prefix: string, rest: string): string =>
      `url(${quote}/${rest.replace(/^\/+/, "")}${quote})`,
  );
  normalized = normalized.replace(/(["'])\.\.\/\/+/g, "$1/");

  return normalized;
}

function sanitizeClassNames(value: string): string {
  if (!value) return "";

  const blocked = new Set(["av-recaptcha-enabled", "av-google-badge-hide"]);
  return value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token && !blocked.has(token))
    .join(" ");
}

function parseMirroredDocument(route: string, sourceFile: string): ParsedMirroredPage {
  const absolutePath = resolve(MIRROR_ROOT, sourceFile);
  const rawFile = readFileSync(absolutePath, "utf-8");

  const htmlTagMatch = rawFile.match(/<html([^>]*)>/i);
  const headMatch = rawFile.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = rawFile.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

  if (!headMatch || !bodyMatch) {
    throw new Error(`Impossible de parser le mirror pour ${route} (${sourceFile})`);
  }

  const htmlAttributes = htmlTagMatch?.[1];
  const bodyAttributes = bodyMatch[1];
  const htmlLang = extractAttribute(htmlAttributes, "lang");

  return {
    route,
    lang: htmlLang && htmlLang.toLowerCase() !== "en-us" ? htmlLang : "es-MX",
    htmlClass: sanitizeClassNames(extractAttribute(htmlAttributes, "class")),
    bodyClass: sanitizeClassNames(extractAttribute(bodyAttributes, "class")),
    headHtml: normalizeInternalLinks(headMatch[1]),
    bodyHtml: normalizeInternalLinks(bodyMatch[2]),
  };
}

export function getMirroredPage(route: string): ParsedMirroredPage {
  const existing = pageCache.get(route);
  if (existing) return existing;

  const definition = MIRRORED_PAGES.find((entry) => entry.route === route);
  if (!definition) {
    throw new Error(`Route miroir inconnue: ${route}`);
  }

  const parsed = parseMirroredDocument(definition.route, definition.sourceFile);
  pageCache.set(route, parsed);
  return parsed;
}
