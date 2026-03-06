import type { APIRoute } from "astro";
import { SUPPORTED_LOCALES, localizedPath } from "../lib/i18n";
import { MIRRORED_PAGES } from "../lib/mirror";
import { ADDITIONAL_STATIC_ROUTES } from "../lib/routes";
import { absoluteUrl, canonicalPath } from "../lib/seo";

export const GET: APIRoute = () => {
  const updatedAt = new Date().toISOString().split("T")[0];
  const routes = [...MIRRORED_PAGES.map((page) => page.route), ...ADDITIONAL_STATIC_ROUTES];
  const urlEntries = Array.from(
    new Set(
      routes.flatMap((route) =>
        SUPPORTED_LOCALES.map((locale) => localizedPath(canonicalPath(route), locale)),
      ),
    ),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries
  .map(
    (path) => `  <url>
    <loc>${absoluteUrl(path)}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === "/" ? "1.0" : "0.8"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
