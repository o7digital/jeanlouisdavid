# 🔧 Guide d'Implémentation - Améliorations SEO
## Jean Louis David Mexico - Code Changes

---

## 📝 FICHIER 1 : src/lib/seo.ts

### Ajout des descriptions manquantes

**À ajouter dans chaque Map de `DESCRIPTION_BY_ROUTE` :**

```typescript
// Dans la section SPANISH (es)
DESCRIPTION_BY_ROUTE: Record<Locale, Map<string, string>> = {
  es: new Map<string, string>([
    // ... lignes existantes ...
    
    // AJOUTER CES 4 LIGNES :
    [
      "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
      "Descubre el Bob Cuadrado, el corte de moda de la temporada. Aprende las características, técnicas de corte y cuidado del Bob Cuadrado en Jean Louis David.",
    ],
    [
      "/looks-de-la-coleccion-primavera-verano-2023/",
      "Inspírate con los mejores looks de primavera-verano 2023. Descubre tendencias en cortes, coloración y estilos en Jean Louis David.",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Mixlight: Técnica innovadora para iluminar el cabello naturalmente. Conoce esta técnica exclusiva de Jean Louis David para un efecto radiant.",
    ],
    [
      "/plurality-coleccion-primavera-verano-2024/",
      "Plurality: Colección Primavera-Verano 2024 de Jean Louis David. Descubre los cortes y estilos de tendencia de esta colección.",
    ],
  ]),
  
  // Dans la section ENGLISH (en)
  en: new Map<string, string>([
    // ... lignes existantes ...
    
    // AJOUTER CES 4 LIGNES :
    [
      "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
      "Discover the Bob Haircut, the trendy cut of the season. Learn the characteristics, cutting techniques and care tips for the Bob at Jean Louis David.",
    ],
    [
      "/looks-de-la-coleccion-primavera-verano-2023/",
      "Inspire yourself with the best looks from spring-summer 2023 collection. Discover trends in haircuts, coloring and styles at Jean Louis David.",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Mixlight: Innovative technique for natural hair highlighting. Discover this exclusive Jean Louis David technique for radiant results.",
    ],
    [
      "/plurality-coleccion-primavera-verano-2024/",
      "Plurality: Spring-Summer 2024 Collection by Jean Louis David. Discover the trendy haircuts and styles of this collection.",
    ],
  ]),
  
  // Dans la section FRENCH (fr)
  fr: new Map<string, string>([
    // ... lignes existantes ...
    
    // AJOUTER CES 4 LIGNES :
    [
      "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
      "Découvrez le Bob Carré, la coupe à la mode de la saison. Apprenez les caractéristiques, techniques et soins du Bob Carré chez Jean Louis David.",
    ],
    [
      "/looks-de-la-coleccion-primavera-verano-2023/",
      "Inspirez-vous avec les meilleurs looks de la collection printemps-été 2023. Découvrez les tendances en coupes, coloration et styles.",
    ],
    [
      "/mixlight-la-tecnica-para-iluminar-el-cabello/",
      "Mixlight : Technique innovante pour éclairer les cheveux naturellement. Découvrez cette technique exclusive de Jean Louis David.",
    ],
    [
      "/plurality-coleccion-primavera-verano-2024/",
      "Plurality : Collection Printemps-Été 2024 de Jean Louis David. Découvrez les coupes et styles tendance de cette collection.",
    ],
  ]),
};
```

### Ajout des titles manquants

**À ajouter dans chaque Map de `TITLE_BY_ROUTE` :**

```typescript
TITLE_BY_ROUTE: Record<Locale, Map<string, string>> = {
  es: new Map<string, string>([
    // ... lignes existantes ...
    
    // AJOUTER CES 4 LIGNES :
    ["/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/", 
     "Bob Cuadrado: Guía Completa del Corte de Moda - Jean Louis David"],
    ["/looks-de-la-coleccion-primavera-verano-2023/", 
     "Looks Primavera-Verano 2023: Inspírate con Jean Louis David"],
    ["/mixlight-la-tecnica-para-iluminar-el-cabello/", 
     "Mixlight: Técnica para Iluminar el Cabello Naturalmente"],
    ["/plurality-coleccion-primavera-verano-2024/", 
     "Plurality: Colección Primavera-Verano 2024 - Tendencias en Cortes"],
  ]),
  
  en: new Map<string, string>([
    // ... lignes existantes ...
    
    // AJOUTER CES 4 LIGNES :
    ["/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/", 
     "Bob Haircut: Complete Guide to the Trendy Cut - Jean Louis David"],
    ["/looks-de-la-coleccion-primavera-verano-2023/", 
     "Spring-Summer 2023 Looks: Get Inspired by Jean Louis David"],
    ["/mixlight-la-tecnica-para-iluminar-el-cabello/", 
     "Mixlight: Technique for Natural Hair Highlighting"],
    ["/plurality-coleccion-primavera-verano-2024/", 
     "Plurality: Spring-Summer 2024 Collection - Trending Haircuts"],
  ]),
  
  fr: new Map<string, string>([
    // ... lignes existantes ...
    
    // AJOUTER CES 4 LIGNES :
    ["/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/", 
     "Bob Carré : Guide Complet de la Coupe Tendance - Jean Louis David"],
    ["/looks-de-la-coleccion-primavera-verano-2023/", 
     "Looks Printemps-Été 2023 : Inspiration Jean Louis David"],
    ["/mixlight-la-tecnica-para-iluminar-el-cabello/", 
     "Mixlight : Technique d'Éclaircissement Capillaire Naturel"],
    ["/plurality-coleccion-primavera-verano-2024/", 
     "Plurality : Collection Printemps-Été 2024 - Coupes Tendance"],
  ]),
};
```

---

## 🖼️ FICHIER 2 : src/components/MirroredDocument.astro

### Amélioration du Schema JSON-LD

**À remplacer la section JSON-LD (ligne ~98) :**

```typescript
// AVANT : 
const jsonLd = getJsonLd({
  canonical,
  description,
  route: page.route,
  title,
  locale,
});

// APRÈS : Ajouter une fonction enrichie dans src/lib/seo.ts
export function getEnrichedJsonLd(props: {
  canonical: string;
  description: string;
  route: string;
  title: string;
  locale: Locale;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  isBlogPost?: boolean;
}): string {
  // Déterminer le type
  const isBlogPost = [
    "/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
    "/looks-de-la-coleccion-primavera-verano-2023/",
    "/mixlight-la-tecnica-para-iluminar-el-cabello/",
    "/plurality-coleccion-primavera-verano-2024/",
  ].includes(props.route);

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": isBlogPost ? "BlogPosting" : "WebPage",
    "url": props.canonical,
    "name": props.title,
    "description": props.description,
    "inLanguage": LOCALE_HTML_TAG[props.locale],
    "publisher": {
      "@type": "Organization",
      "name": "Jean Louis David",
      "logo": {
        "@type": "ImageObject",
        "url": absoluteUrl("/wp-content/uploads/2024/07/logo-bco.png"),
        "width": 340,
        "height": 156,
      },
    },
  };

  if (isBlogPost) {
    return JSON.stringify({
      ...baseSchema,
      "@type": "BlogPosting",
      "image": props.imageUrl || absoluteUrl(DEFAULT_OG_IMAGE),
      "datePublished": props.datePublished || new Date().toISOString(),
      "dateModified": props.dateModified || new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "Jean Louis David",
      },
      "articleBody": "See content on the page",
    });
  }

  return JSON.stringify(baseSchema);
}
```

### Ajouter Breadcrumb Schema

**Ajouter après la section JSON-LD dans MirroredDocument.astro :**

```astro
---
// Fonction helper pour générer breadcrumbs
function generateBreadcrumbs(route: string, locale: Locale) {
  const breadcrumbs = [
    {
      position: 1,
      name: locale === 'es' ? "Inicio" : locale === 'en' ? "Home" : "Accueil",
      item: absoluteUrl(localizedPath("/", locale)),
    },
  ];

  // Ajouter les segments intermédiaires
  const segments = route.split('/').filter(Boolean);
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    if (index < segments.length - 1) { // Pas le dernier
      breadcrumbs.push({
        position: index + 2,
        name: segment.replace(/-/g, ' '),
        item: absoluteUrl(localizedPath(currentPath + '/', locale)),
      });
    }
  });

  return breadcrumbs;
}

const breadcrumbs = generateBreadcrumbs(page.route, locale);
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map(b => ({
    "@type": "ListItem",
    "position": b.position,
    "name": b.name,
    "item": b.item,
  })),
};
---

<!-- Dans la section <head> : -->
<script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
```

---

## 🏷️ FICHIER 3 : Ajouter les attributs ALT aux images

### Option A : Dans le HTML mirroir (src/lib/mirror.ts)

```typescript
// Ajouter une function pour enrichir les ALT texts
function enrichImageAltText(markup: string, route: string): string {
  // Map des alt texts par route
  const altMap = new Map<string, Map<string, string>>([
    ["/", new Map([
      ["slide_01-1280x630", "Banner principal Jean Louis David con servicios de corte y coloración"],
      ["slide_02-1280x630", "Estilista Jean Louis David aplicando técnicas de coloración premium"],
      // ... etc
    ])],
    ["/servicios/", new Map([
      ["coleccion-momento", "Icono de servicios - Corte, coloración, manicure y pedicure"],
      // ... etc
    ])],
  ]);

  const routeAlts = altMap.get(route);
  if (!routeAlts) return markup;

  let enriched = markup;
  for (const [imageKey, altText] of routeAlts) {
    enriched = enriched.replace(
      new RegExp(`(<img[^>]*?src="[^"]*${imageKey}[^"]*?"[^>]*?)\\s*alt=""`, 'gi'),
      `$1 alt="${altText}"`
    );
  }

  return enriched;
}

// Utiliser dans parseMirroredDocument
function parseMirroredDocument(route: string, sourceFile: string): ParsedMirroredPage {
  // ... code existant ...
  
  let bodyHtml = normalizeInternalLinks(bodyMatch[2]);
  bodyHtml = enrichImageAltText(bodyHtml, route); // AJOUTER CETTE LIGNE
  
  return {
    route,
    // ... rest of return
  };
}
```

### Option B : Solution CSS-in-JS (plus simple)

Ajouter dans `src/components/MirroredDocument.astro` :

```astro
<script>
// Auto-enrich ALT texts basé sur image source et contexte
document.addEventListener('DOMContentLoaded', () => {
  const altMap = {
    'slide_01': 'Banner principal Jean Louis David con servicios de corte y coloración',
    'slide_02': 'Estilista Jean Louis David aplicando técnicas de coloración premium',
    'coleccion-momento': 'Colección Momento: Cortes y estilos de moda de Jean Louis David',
    'sucursales': 'Ubica Jean Louis David en México - Mapa de sucursales y ubicaciones',
    'contacto': 'Contacta Jean Louis David para agendar tu cita - WhatsApp y formulario',
    'logo-bco': 'Logo Jean Louis David - Salón de belleza y barbería',
  };

  document.querySelectorAll('img[alt=""], img:not([alt])').forEach(img => {
    const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
    for (const [key, alt] of Object.entries(altMap)) {
      if (src.includes(key)) {
        img.setAttribute('alt', alt);
        break;
      }
    }
  });
});
</script>
```

---

## 📊 FICHIER 4 : Nouvelle fonction pour OG Images uniques

**Ajouter dans src/lib/seo.ts :**

```typescript
// Map des images OG par page
const OG_IMAGE_BY_ROUTE: Record<Locale, Map<string, string>> = {
  es: new Map<string, string>([
    ["/", "/wp-content/uploads/2024/07/slide_01-1280x630.webp"],
    ["/servicios/", "/wp-content/uploads/2024/09/coleccion-momento.webp"],
    ["/sucursales/", "/wp-content/uploads/2024/09/sucursales.webp"],
    ["/contacto/", "/wp-content/uploads/2024/09/contacto2.webp"],
    ["/colecciones/", "/wp-content/uploads/2024/09/coleccion-momento.webp"],
    ["/nosotros/", "/wp-content/uploads/2024/07/logo-bco.webp"],
    ["/privacidad/", "/wp-content/uploads/2024/07/slide_01-1280x630.webp"],
    ["/adopta-el-bob-cuadrado-el-corte-de-moda-de-la-temporada/",
     "/wp-content/uploads/2024/bob-cuadrado-og.webp"],
    ["/looks-de-la-coleccion-primavera-verano-2023/",
     "/wp-content/uploads/2024/looks-pv2023-og.webp"],
    ["/mixlight-la-tecnica-para-iluminar-el-cabello/",
     "/wp-content/uploads/2024/mixlight-og.webp"],
    ["/plurality-coleccion-primavera-verano-2024/",
     "/wp-content/uploads/2024/plurality-2024-og.webp"],
  ]),
  // Répéter pour en et fr...
};

export function getSeoImageUrl(route: string = "/", locale: Locale = DEFAULT_LOCALE): string {
  const normalizedRoute = canonicalPath(route);
  const routeImages = OG_IMAGE_BY_ROUTE[locale];
  const imageUrl = routeImages?.get(normalizedRoute);
  
  return absoluteUrl(imageUrl || DEFAULT_OG_IMAGE);
}
```

**Utiliser dans MirroredDocument.astro :**

```astro
---
// Remplacer la ligne existante
const ogImage = getSeoImageUrl(page.route, locale); // AJOUTER locale

// Et passer le route à la fonction
const ogImageUrl = getSeoImageUrl(page.route, locale);
---

<meta property="og:image" content={ogImageUrl} />
```

---

## 🚀 PLAN D'IMPLÉMENTATION

### Jour 1 : Descriptions et Titles
- [ ] Copier les 4 descriptions pour chaque locale (12 lignes)
- [ ] Copier les 4 titles pour chaque locale (12 lignes)
- [ ] Tester avec lighthouse
- [ ] Commit git

**Fichier:** `src/lib/seo.ts`  
**Temps:** 30 minutes

### Jour 2 : ALT Texts
- [ ] Choisir Option A ou B pour ajouter ALT texts
- [ ] Implémenter une des deux solutions
- [ ] Vérifier avec axe DevTools
- [ ] Commit git

**Fichier:** `src/lib/mirror.ts` ou `src/components/MirroredDocument.astro`  
**Temps:** 1-2 heures

### Jour 3 : Schema enrichi
- [ ] Ajouter BlogPosting schema
- [ ] Ajouter BreadcrumbList schema
- [ ] Tester avec Google Rich Results
- [ ] Commit git

**Fichier:** `src/lib/seo.ts` + `src/components/MirroredDocument.astro`  
**Temps:** 1 heure

### Jour 4 : OG Images
- [ ] Mapper les images OG uniques
- [ ] Implémenter la fonction enrichie
- [ ] Tester avec Facebook Sharing Debugger
- [ ] Commit git

**Fichier:** `src/lib/seo.ts`  
**Temps:** 45 minutes

### Jour 5 : Images Optimization
- [ ] Exécuter image-optimizer.js
- [ ] Vérifier les résultats
- [ ] Remplacer les fichiers originaux
- [ ] Test performance avec Lighthouse
- [ ] Commit git

**Fichier:** `public/wp-content/uploads/*`  
**Temps:** 2-3 heures

---

## ✅ VALIDATION

Après chaque implémentation, exécuter :

```bash
# 1. Build
npm run build

# 2. Lighthouse audit
npm run preview &
# Ouvrir localhost:3000 dans Chrome DevTools → Lighthouse

# 3. SEO validation
# Ouvrir https://jeanlouisdavid.com.mx/sitemap.xml
# Vérifier les URLs incluent les nouvelles pages

# 4. Rich results
# https://search.google.com/test/rich-results
# Copier le HTML du rendu final

# 5. Accessibilité
# https://www.accessibilityinsights.io/
# Scanner l'entier site

# 6. Image validation
# https://weblur.dev/
# Vérifier les images WebP et compressées
```

---

## 📞 Support

Si vous avez des questions sur l'implémentation :

1. Vérifiez les commentaires dans le code
2. Testez avec les outils Google
3. Consultez la documentation web.dev
4. Utilisez lighthouse CI pour l'automatisation

**Total de travail estimé : 6-8 heures**  
**Impact SEO attendu : +25-35% en rankings**
