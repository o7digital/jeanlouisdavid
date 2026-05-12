import type { Locale } from "../lib/i18n";
import { datoRequest } from "../lib/datocms";

export type ServiceItem = {
  label: string;
  price: string;
  note?: string;
};

export type ServiceSection = {
  title: string;
  image: {
    src: string;
    srcset: string;
    sizes: string;
    width: number;
    height: number;
    title: string;
    alt: string;
  };
  items: ServiceItem[];
  note?: string;
};

export type ServicesPageContent = {
  heading: string;
  intro: string;
  sections: [ServiceSection, ServiceSection, ServiceSection, ServiceSection];
  ctaTitle: string;
  ctaLabel: string;
  ctaAriaLabel: string;
  ctaHref: string;
};

const SHARED_IMAGES = {
  haircuts: {
    src: "/wp-content/uploads/2024/09/cortes.webp",
    srcset:
      "/wp-content/uploads/2024/09/cortes.webp 900w, /wp-content/uploads/2024/09/cortes-300x133.webp 300w, /wp-content/uploads/2024/09/cortes-768x341.webp 768w, /wp-content/uploads/2024/09/cortes-705x313.webp 705w",
    sizes: "(max-width: 900px) 100vw, 900px",
    width: 900,
    height: 400,
  },
  styling: {
    src: "/wp-content/uploads/2024/09/peinados.webp",
    srcset:
      "/wp-content/uploads/2024/09/peinados.webp 900w, /wp-content/uploads/2024/09/peinados-300x133.webp 300w, /wp-content/uploads/2024/09/peinados-768x341.webp 768w, /wp-content/uploads/2024/09/peinados-705x313.webp 705w",
    sizes: "(max-width: 900px) 100vw, 900px",
    width: 900,
    height: 400,
  },
  nails: {
    src: "/wp-content/uploads/2024/09/manicure-y-pedicure.webp",
    srcset:
      "/wp-content/uploads/2024/09/manicure-y-pedicure.webp 900w, /wp-content/uploads/2024/09/manicure-y-pedicure-300x133.webp 300w, /wp-content/uploads/2024/09/manicure-y-pedicure-768x341.webp 768w, /wp-content/uploads/2024/09/manicure-y-pedicure-705x313.webp 705w",
    sizes: "(max-width: 900px) 100vw, 900px",
    width: 900,
    height: 400,
  },
  barbering: {
    src: "/wp-content/uploads/2024/09/barberia.webp",
    srcset:
      "/wp-content/uploads/2024/09/barberia.webp 900w, /wp-content/uploads/2024/09/barberia-300x133.webp 300w, /wp-content/uploads/2024/09/barberia-768x341.webp 768w, /wp-content/uploads/2024/09/barberia-705x313.webp 705w",
    sizes: "(max-width: 900px) 100vw, 900px",
    width: 900,
    height: 400,
  },
} as const;

const SERVICES_PAGE_BY_LOCALE: Record<Locale, ServicesPageContent> = {
  es: {
    heading: "Nuestros Servicios",
    intro:
      "En Jean Louis David, ofrecemos una selección de servicios de para realzar tu belleza. Nuestros expertos están listos para brindarte cortes, peinados, barbería y tratamientos para manos y pies con la máxima atención al detalle. Descubre la diferencia en cada visita.",
    sections: [
      {
        title: "Cortes",
        image: {
          ...SHARED_IMAGES.haircuts,
          title: "Cortes",
          alt: "Servicios de corte Jean Louis David en CDMX",
        },
        items: [
          { label: "Corte Dama", price: "$1,200" },
          { label: "Corte Caballero", price: "$1,000" },
          { label: "Director Artístico Dama", price: "$1,400" },
          { label: "Director Artístico Caballero", price: "$1,150" },
        ],
      },
      {
        title: "Peinado",
        image: {
          ...SHARED_IMAGES.styling,
          title: "Peinados",
          alt: "Servicios de peinado Jean Louis David en CDMX",
        },
        items: [
          { label: "Peinado Corto", price: "$400", note: "(al oído)" },
          { label: "Peinado Mediano", price: "$490" },
          { label: "Peinado Largo", price: "$550 - $650", note: "(a media espalda)" },
          { label: "Peinado Extra Largo", price: "$720 - $800" },
          { label: "Peinado Recogido", price: "$800 - $900 - $1,100" },
        ],
        note: "Nota: el precio puede variar por tipo de peinado, largo y densidad de cabello.",
      },
      {
        title: "Manicure y Pedicure",
        image: {
          ...SHARED_IMAGES.nails,
          title: "Manicure y Pedicure",
          alt: "Servicios de manicure y pedicure en Jean Louis David CDMX",
        },
        items: [
          { label: "Manicure Normal", price: "$360" },
          { label: "Manicure con Gel", price: "$630" },
          { label: "Manicure Spa", price: "$500" },
          { label: "Pedicura", price: "$470" },
          { label: "Pedicura con Gel", price: "$750" },
          { label: "Pedicura Spa", price: "$700" },
          { label: "Geleration", price: "$350" },
          { label: "Cambio de Esmalte", price: "$200" },
          { label: "Remover Gel", price: "$190" },
          { label: "Remover Set Acrílico", price: "$400" },
          { label: "Set de Uñas de Acrílico", price: "$1,100" },
          { label: "Parche de Uña", price: "$80" },
          { label: "Uña de Arcílico (c/u)", price: "$130" },
        ],
      },
      {
        title: "Barbería",
        image: {
          ...SHARED_IMAGES.barbering,
          title: "Barbería",
          alt: "Servicios de barbería Jean Louis David en CDMX",
        },
        items: [
          { label: "Bigote", price: "$350" },
          { label: "Media Barba", price: "$500" },
        ],
      },
    ],
    ctaTitle: "Agenda tu Cita",
    ctaLabel: "Haz tu Cita por WhatsApp ahora",
    ctaAriaLabel: "Haz tu Cita por WhatsApp ahora",
    ctaHref: "https://wa.me/525591856623",
  },
  en: {
    heading: "Our Services",
    intro:
      "At Jean Louis David, we offer a selection of services to enhance your beauty. Our experts are ready to provide haircuts, styling, barbering, and hand and foot treatments with exceptional attention to detail. Discover the difference in every visit.",
    sections: [
      {
        title: "Haircuts",
        image: {
          ...SHARED_IMAGES.haircuts,
          title: "Haircuts",
          alt: "Jean Louis David haircut services in CDMX",
        },
        items: [
          { label: "Women's Haircut", price: "$1,200" },
          { label: "Men's Haircut", price: "$1,000" },
          { label: "Art Director Women's Cut", price: "$1,400" },
          { label: "Art Director Men's Cut", price: "$1,150" },
        ],
      },
      {
        title: "Styling",
        image: {
          ...SHARED_IMAGES.styling,
          title: "Stylings",
          alt: "Jean Louis David styling services in CDMX",
        },
        items: [
          { label: "Short Styling", price: "$400", note: "(ear length)" },
          { label: "Medium Styling", price: "$490" },
          { label: "Long Styling", price: "$550 - $650", note: "(mid-back length)" },
          { label: "Extra Long Styling", price: "$720 - $800" },
          { label: "Updo Styling", price: "$800 - $900 - $1,100" },
        ],
        note: "Note: prices may vary depending on hairstyle type, length, and hair density.",
      },
      {
        title: "Manicure and Pedicure",
        image: {
          ...SHARED_IMAGES.nails,
          title: "Manicure and Pedicure",
          alt: "Jean Louis David manicure and pedicure services in CDMX",
        },
        items: [
          { label: "Classic Manicure", price: "$360" },
          { label: "Gel Manicure", price: "$630" },
          { label: "Spa Manicure", price: "$500" },
          { label: "Pedicure", price: "$470" },
          { label: "Gel Pedicure", price: "$750" },
          { label: "Spa Pedicure", price: "$700" },
          { label: "Geleration", price: "$350" },
          { label: "Polish Change", price: "$200" },
          { label: "Gel Removal", price: "$190" },
          { label: "Acrylic Set Removal", price: "$400" },
          { label: "Acrylic Nail Set", price: "$1,100" },
          { label: "Nail Patch", price: "$80" },
          { label: "Acrylic Nail (each)", price: "$130" },
        ],
      },
      {
        title: "Barbering",
        image: {
          ...SHARED_IMAGES.barbering,
          title: "Barbering",
          alt: "Jean Louis David barber services in CDMX",
        },
        items: [
          { label: "Mustache", price: "$350" },
          { label: "Half Beard", price: "$500" },
        ],
      },
    ],
    ctaTitle: "Book Your Appointment",
    ctaLabel: "Book on WhatsApp Now",
    ctaAriaLabel: "Book on WhatsApp Now",
    ctaHref: "https://wa.me/525591856623",
  },
  fr: {
    heading: "Nos services",
    intro:
      "Chez Jean Louis David, nous proposons une sélection de services pour sublimer votre beauté. Nos experts réalisent coupes, coiffures, services barbier et soins des mains et des pieds avec une attention maximale aux détails. Découvrez la différence à chaque visite.",
    sections: [
      {
        title: "Coupes",
        image: {
          ...SHARED_IMAGES.haircuts,
          title: "Coupes",
          alt: "Services de coupe Jean Louis David a CDMX",
        },
        items: [
          { label: "Coupe Femme", price: "$1,200" },
          { label: "Coupe Homme", price: "$1,000" },
          { label: "Directeur artistique Femme", price: "$1,400" },
          { label: "Directeur artistique Homme", price: "$1,150" },
        ],
      },
      {
        title: "Coiffure",
        image: {
          ...SHARED_IMAGES.styling,
          title: "Coiffures",
          alt: "Services de coiffure Jean Louis David a CDMX",
        },
        items: [
          { label: "Coiffure courte", price: "$400", note: "(aux oreilles)" },
          { label: "Coiffure mi-longue", price: "$490" },
          { label: "Coiffure longue", price: "$550 - $650", note: "(mi-dos)" },
          { label: "Coiffure extra longue", price: "$720 - $800" },
          { label: "Coiffure attachée", price: "$800 - $900 - $1,100" },
        ],
        note: "Note : le prix peut varier selon le type de coiffure, la longueur et la densite des cheveux.",
      },
      {
        title: "Manucure et pedicure",
        image: {
          ...SHARED_IMAGES.nails,
          title: "Manucure et pedicure",
          alt: "Services de manucure et pedicure Jean Louis David a CDMX",
        },
        items: [
          { label: "Manucure classique", price: "$360" },
          { label: "Manucure avec gel", price: "$630" },
          { label: "Manucure spa", price: "$500" },
          { label: "Pedicure", price: "$470" },
          { label: "Pedicure avec gel", price: "$750" },
          { label: "Pedicure spa", price: "$700" },
          { label: "Geleration", price: "$350" },
          { label: "Changement de vernis", price: "$200" },
          { label: "Retrait du gel", price: "$190" },
          { label: "Retrait du set acrylique", price: "$400" },
          { label: "Pose complete acrylique", price: "$1,100" },
          { label: "Reparation d'ongle", price: "$80" },
          { label: "Ongle acrylique (unite)", price: "$130" },
        ],
      },
      {
        title: "Barbier",
        image: {
          ...SHARED_IMAGES.barbering,
          title: "Barbier",
          alt: "Services barbier Jean Louis David a CDMX",
        },
        items: [
          { label: "Moustache", price: "$350" },
          { label: "Demi-barbe", price: "$500" },
        ],
      },
    ],
    ctaTitle: "Prenez rendez-vous",
    ctaLabel: "Prenez rendez-vous sur WhatsApp maintenant",
    ctaAriaLabel: "Prenez rendez-vous sur WhatsApp maintenant",
    ctaHref: "https://wa.me/525591856623",
  },
};

type DatoStructuredText = {
  value?: {
    document?: {
      children?: Array<{
        children?: Array<{
          value?: string;
        }>;
      }>;
    };
  };
};

type DatoService = {
  title?: string | null;
  slug?: string | null;
  shortDescription?: DatoStructuredText | string | null;
  order?: number | null;
  locale?: string | null;
};

type DatoServicesResponse = {
  allServices?: DatoService[];
};

const SERVICES_QUERY = `
  query Services($locale: String!) {
    allServices(filter: { locale: { eq: $locale } }, orderBy: order_ASC) {
      title
      slug
      shortDescription {
        value
      }
      order
      locale
    }
  }
`;

function structuredTextToPlainText(value: DatoStructuredText | string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value.trim() || undefined;

  const paragraphs = value.value?.document?.children ?? [];
  const text = paragraphs
    .map((paragraph) => paragraph.children?.map((child) => child.value ?? "").join("") ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return text || undefined;
}

function mergeDatoServices(fallback: ServicesPageContent, services: DatoService[]): ServicesPageContent {
  const fallbackBySlug = new Map([
    ["cortes", fallback.sections[0]],
    ["peinados", fallback.sections[1]],
    ["manicure-pedicure", fallback.sections[2]],
    ["barberia", fallback.sections[3]],
  ]);
  const seen = new Set<string>();
  const mergedSections: ServiceSection[] = [];

  for (const service of services) {
    const slug = service.slug?.trim();
    if (!slug || seen.has(slug)) continue;

    const fallbackSection = fallbackBySlug.get(slug);
    if (!fallbackSection) continue;

    seen.add(slug);
    mergedSections.push({
      ...fallbackSection,
      title: service.title?.trim() || fallbackSection.title,
      note: structuredTextToPlainText(service.shortDescription) ?? fallbackSection.note,
    });
  }

  if (mergedSections.length < 4) {
    return fallback;
  }

  return {
    ...fallback,
    sections: mergedSections.slice(0, 4) as [ServiceSection, ServiceSection, ServiceSection, ServiceSection],
  };
}

export async function getServicesPageContent(locale: Locale): Promise<ServicesPageContent> {
  const fallback = SERVICES_PAGE_BY_LOCALE[locale];
  const data = await datoRequest<DatoServicesResponse>(SERVICES_QUERY, { locale });
  const services = data?.allServices ?? [];

  if (!services.length) {
    return fallback;
  }

  return mergeDatoServices(fallback, services);
}
