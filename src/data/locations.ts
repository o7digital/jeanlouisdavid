import type { Locale } from "../lib/i18n";
import { datoRequest } from "../lib/datocms";

export type LocationCard = {
  title: string;
  venue: string;
  addressLines: [string, string, string];
  phone: string;
};

export type LocationsPageContent = {
  heading: string;
  intro: string;
  locations: [LocationCard, LocationCard];
  ctaTitle: string;
  ctaLabel: string;
  ctaAriaLabel: string;
  ctaHref: string;
  mapTitle: string;
  mapEmbedUrl: string;
};

const SANTA_FE_MAP_QUERY =
  "Juan Salvador Agraz 15, Santa Fe, Cuajimalpa de Morelos 05348 Ciudad de Mexico";

const LOCATIONS_PAGE_BY_LOCALE: Record<Locale, LocationsPageContent> = {
  es: {
    heading: "Sucursales en México",
    intro:
      "Encuentra tu salón Jean Louis David más cercano y vive una experiencia de belleza exclusiva. Visítanos en nuestras sucursales y disfruta del mejor cuidado capilar y estilismo con un enfoque personalizado y la excelencia que nos distingue.",
    locations: [
      {
        title: "Santa Fe",
        venue: "Plaza Corner 15",
        addressLines: [
          "Juan Salvador Agraz 15 y Av. Vasco de Quiroga",
          "Local 201A Col. Santa Fe,",
          "Cuajimalpa de Morelos, Ciudad de México",
        ],
        phone: "Tel. 55 5292 4717 y 55 5292 5006",
      },
      {
        title: "Polanco",
        venue: "Hotel Presidente Intercontinental",
        addressLines: [
          "Campos Elíseos 218",
          "Polanco IV Sección,",
          "Miguel Hidalgo, Ciudad de México",
        ],
        phone: "Tel. 55 5280 7039 y 55 5280 2183",
      },
    ],
    ctaTitle: "Agenda tu Cita",
    ctaLabel: "Haz tu Cita por WhatsApp ahora",
    ctaAriaLabel: "Haz tu Cita por WhatsApp ahora",
    ctaHref: "https://wa.me/525591856623",
    mapTitle: "Mapa de la sucursal Santa Fe",
    mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(SANTA_FE_MAP_QUERY)}&output=embed`,
  },
  en: {
    heading: "Our Salons in Mexico",
    intro:
      "Find your nearest Jean Louis David salon and enjoy an exclusive beauty experience. Visit our locations and discover premium hair care and styling with a personalized approach and the excellence that defines us.",
    locations: [
      {
        title: "Santa Fe",
        venue: "Plaza Corner 15",
        addressLines: [
          "Juan Salvador Agraz 15 and Av. Vasco de Quiroga",
          "Local 201A, Santa Fe",
          "Cuajimalpa de Morelos, Mexico City",
        ],
        phone: "Phone: 55 5292 4717 and 55 5292 5006",
      },
      {
        title: "Polanco",
        venue: "Hotel Presidente Intercontinental",
        addressLines: [
          "Campos Eliseos 218",
          "Polanco IV Section,",
          "Miguel Hidalgo, Mexico City",
        ],
        phone: "Phone: 55 5280 7039 and 55 5280 2183",
      },
    ],
    ctaTitle: "Book Your Appointment",
    ctaLabel: "Book on WhatsApp Now",
    ctaAriaLabel: "Book on WhatsApp Now",
    ctaHref: "https://wa.me/525591856623",
    mapTitle: "Santa Fe salon map",
    mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(SANTA_FE_MAP_QUERY)}&output=embed`,
  },
  fr: {
    heading: "Nos salons au Mexique",
    intro:
      "Trouvez le salon Jean Louis David le plus proche et vivez une expérience beauté exclusive. Visitez nos salons et profitez des meilleurs soins capillaires et du stylisme avec une approche personnalisée et l'excellence qui nous distingue.",
    locations: [
      {
        title: "Santa Fe",
        venue: "Plaza Corner 15",
        addressLines: [
          "Juan Salvador Agraz 15 et Av. Vasco de Quiroga",
          "Local 201A, Santa Fe",
          "Cuajimalpa de Morelos, Mexico City",
        ],
        phone: "Tel. 55 5292 4717 et 55 5292 5006",
      },
      {
        title: "Polanco",
        venue: "Hotel Presidente Intercontinental",
        addressLines: [
          "Campos Elyseos 218",
          "Polanco IV Section,",
          "Miguel Hidalgo, Mexico City",
        ],
        phone: "Tel. 55 5280 7039 et 55 5280 2183",
      },
    ],
    ctaTitle: "Prenez rendez-vous",
    ctaLabel: "Prenez rendez-vous sur WhatsApp maintenant",
    ctaAriaLabel: "Prenez rendez-vous sur WhatsApp maintenant",
    ctaHref: "https://wa.me/525591856623",
    mapTitle: "Carte du salon Santa Fe",
    mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(SANTA_FE_MAP_QUERY)}&output=embed`,
  },
};

type DatoSalon = {
  name?: string | null;
  slug?: string | null;
  address?: string | null;
  phone?: string | null;
  googleMapUrl?: string | null;
  order?: number | null;
};

type DatoSalonsResponse = {
  allSalons?: DatoSalon[];
};

const SALONS_QUERY = `
  query Salons {
    allSalons(orderBy: order_ASC) {
      name
      slug
      address
      phone
      googleMapUrl
      order
    }
  }
`;

function splitAddressLines(address: string | null | undefined, fallback: [string, string, string]): [string, string, string] {
  const normalized = address?.trim();

  if (!normalized) {
    return fallback;
  }

  const parts = normalized
    .split(/\n|,\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  return [
    parts[0] ?? fallback[0],
    parts.slice(1, -1).join(", ") || fallback[1],
    parts.at(-1) ?? fallback[2],
  ];
}

function mergeDatoSalons(fallback: LocationsPageContent, salons: DatoSalon[]): LocationsPageContent {
  const fallbackBySlug = new Map([
    ["santa-fe", fallback.locations[0]],
    ["polanco", fallback.locations[1]],
  ]);
  const mergedLocations: LocationCard[] = [];

  for (const salon of salons) {
    const slug = salon.slug?.trim();
    if (!slug) continue;

    const fallbackLocation = fallbackBySlug.get(slug);
    if (!fallbackLocation) continue;

    mergedLocations.push({
      ...fallbackLocation,
      title: salon.name?.replace(/^Jean Louis David\s*/i, "").trim() || fallbackLocation.title,
      addressLines: splitAddressLines(salon.address, fallbackLocation.addressLines),
      phone: salon.phone?.trim() || fallbackLocation.phone,
    });
  }

  if (mergedLocations.length < 2) {
    return fallback;
  }

  const santaFeMapUrl = salons.find((salon) => salon.slug === "santa-fe")?.googleMapUrl?.trim();

  return {
    ...fallback,
    locations: mergedLocations.slice(0, 2) as [LocationCard, LocationCard],
    mapEmbedUrl: santaFeMapUrl || fallback.mapEmbedUrl,
  };
}

export async function getLocationsPageContent(locale: Locale): Promise<LocationsPageContent> {
  const fallback = LOCATIONS_PAGE_BY_LOCALE[locale];
  const data = await datoRequest<DatoSalonsResponse>(SALONS_QUERY);
  const salons = data?.allSalons ?? [];

  if (!salons.length) {
    return fallback;
  }

  return mergeDatoSalons(fallback, salons);
}
