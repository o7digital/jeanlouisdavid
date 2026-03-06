import type { Locale } from "../lib/i18n";

type ContactFormField = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "hidden";
  required?: boolean;
  className: string;
};

type ContactCard = {
  title: string;
  lines: string[];
  iconClass: string;
};

export type ContactPageContent = {
  heading: string;
  intro: string;
  ctaTitle: string;
  ctaLabel: string;
  ctaAriaLabel: string;
  ctaHref: string;
  formHeading: string;
  formAction: string;
  fieldsWithError: string;
  sendingLabel: string;
  submitLabel: string;
  contactDetailsHeading: string;
  cards: [ContactCard, ContactCard];
  formFields: {
    name: ContactFormField;
    phone: ContactFormField;
    email: ContactFormField;
    message: ContactFormField;
    honeypot: ContactFormField;
  };
};

function contactAction(locale: Locale): string {
  return locale === "es" ? "/contacto/" : `/${locale}/contacto/`;
}

const CONTACT_PAGE_BY_LOCALE: Record<Locale, ContactPageContent> = {
  es: {
    heading: "Contacto",
    intro:
      "¿Deseas más información sobre nuestros servicios? No dudes en contactarnos, nuestro equipo en Jean Louis David estará encantado de asistirte.",
    ctaTitle: "Agenda tu Cita",
    ctaLabel: "Haz tu Cita por WhatsApp ahora",
    ctaAriaLabel: "Haz tu Cita por WhatsApp ahora",
    ctaHref: "https://wa.me/525591856623",
    formHeading: "Envíanos un mensaje",
    formAction: contactAction("es"),
    fieldsWithError: "Found errors in the following field(s):",
    sendingLabel: "Sending",
    submitLabel: "Enviar mensaje",
    contactDetailsHeading: "Datos de contacto",
    cards: [
      {
        title: "Sucursal Santa Fe",
        lines: [
          "Plaza Corner 15",
          "Juan Salvador Agraz #15",
          "Local 201A Col. Santa Fe,",
          "Cuajimalpa de Morelos, Ciudad de México",
          "Tel. 55 5292 4717 y 55 5292 5006",
        ],
        iconClass: "av-m0q2i6ne-7cdf7e64f9d3166b4fe1b52a291184cd",
      },
      {
        title: "Sucursal Polanco",
        lines: [
          "Hotel Presidente Intercontinental",
          "Campos Elíseos #218",
          "Polanco IV Sección,",
          "Miguel Hidalgo, Ciudad de México",
          "Tel. 55 5280 7039 y 55 5280 2183",
        ],
        iconClass: "av-m0q2k0o8-5cd45036eb3cfc1e42f63343c6aa63de",
      },
    ],
    formFields: {
      name: {
        id: "avia_1_1",
        name: "avia_1_1",
        label: "Nombre",
        placeholder: "Nombre*",
        type: "text",
        required: true,
        className: "text_input is_empty",
      },
      phone: {
        id: "avia_2_1",
        name: "avia_2_1",
        label: "Teléfono / WhatsApp",
        placeholder: "Teléfono / WhatsApp*",
        type: "text",
        required: true,
        className: "text_input is_empty",
      },
      email: {
        id: "avia_3_1",
        name: "avia_3_1",
        label: "Email",
        placeholder: "Email",
        type: "text",
        className: "text_input ",
      },
      message: {
        id: "avia_4_1",
        name: "avia_4_1",
        label: "Mensaje",
        placeholder: "Mensaje",
        type: "textarea",
        className: "text_area ",
      },
      honeypot: {
        id: "avia_5_1",
        name: "avia_5_1",
        label: "",
        placeholder: "",
        type: "hidden",
        className: "hidden ",
      },
    },
  },
  en: {
    heading: "Contact Us",
    intro:
      "Would you like more information about our services? Feel free to contact us, our Jean Louis David team will be happy to assist you.",
    ctaTitle: "Book Your Appointment",
    ctaLabel: "Book on WhatsApp Now",
    ctaAriaLabel: "Book on WhatsApp Now",
    ctaHref: "https://wa.me/525591856623",
    formHeading: "Send us a message",
    formAction: contactAction("en"),
    fieldsWithError: "Found errors in the following field(s):",
    sendingLabel: "Sending",
    submitLabel: "Send Message",
    contactDetailsHeading: "Contact Details",
    cards: [
      {
        title: "Santa Fe Branch",
        lines: [
          "Plaza Corner 15",
          "Juan Salvador Agraz #15",
          "Local 201A Col. Santa Fe,",
          "Cuajimalpa de Morelos, Ciudad de México",
          "Tel. 55 5292 4717 y 55 5292 5006",
        ],
        iconClass: "av-m0q2i6ne-7cdf7e64f9d3166b4fe1b52a291184cd",
      },
      {
        title: "Polanco Branch",
        lines: [
          "Hotel Presidente Intercontinental",
          "Campos Elíseos #218",
          "Polanco IV Sección,",
          "Miguel Hidalgo, Ciudad de México",
          "Tel. 55 5280 7039 y 55 5280 2183",
        ],
        iconClass: "av-m0q2k0o8-5cd45036eb3cfc1e42f63343c6aa63de",
      },
    ],
    formFields: {
      name: {
        id: "avia_1_1",
        name: "avia_1_1",
        label: "Name",
        placeholder: "Name*",
        type: "text",
        required: true,
        className: "text_input is_empty",
      },
      phone: {
        id: "avia_2_1",
        name: "avia_2_1",
        label: "Phone / WhatsApp",
        placeholder: "Phone / WhatsApp*",
        type: "text",
        required: true,
        className: "text_input is_empty",
      },
      email: {
        id: "avia_3_1",
        name: "avia_3_1",
        label: "Email",
        placeholder: "Email",
        type: "text",
        className: "text_input ",
      },
      message: {
        id: "avia_4_1",
        name: "avia_4_1",
        label: "Message",
        placeholder: "Message",
        type: "textarea",
        className: "text_area ",
      },
      honeypot: {
        id: "avia_5_1",
        name: "avia_5_1",
        label: "",
        placeholder: "",
        type: "hidden",
        className: "hidden ",
      },
    },
  },
  fr: {
    heading: "Contact",
    intro:
      "Vous souhaitez plus d'informations sur nos services ? N'hésitez pas à nous contacter, l'équipe Jean Louis David sera ravie de vous accompagner.",
    ctaTitle: "Prenez rendez-vous",
    ctaLabel: "Prenez rendez-vous sur WhatsApp maintenant",
    ctaAriaLabel: "Prenez rendez-vous sur WhatsApp maintenant",
    ctaHref: "https://wa.me/525591856623",
    formHeading: "Envoyez-nous un message",
    formAction: contactAction("fr"),
    fieldsWithError: "Found errors in the following field(s):",
    sendingLabel: "Sending",
    submitLabel: "Envoyer le message",
    contactDetailsHeading: "Coordonnées",
    cards: [
      {
        title: "Salon Santa Fe",
        lines: [
          "Plaza Corner 15",
          "Juan Salvador Agraz #15",
          "Local 201A Col. Santa Fe,",
          "Cuajimalpa de Morelos, Ciudad de México",
          "Tel. 55 5292 4717 y 55 5292 5006",
        ],
        iconClass: "av-m0q2i6ne-7cdf7e64f9d3166b4fe1b52a291184cd",
      },
      {
        title: "Salon Polanco",
        lines: [
          "Hotel Presidente Intercontinental",
          "Campos Elíseos #218",
          "Polanco IV Sección,",
          "Miguel Hidalgo, Ciudad de México",
          "Tel. 55 5280 7039 y 55 5280 2183",
        ],
        iconClass: "av-m0q2k0o8-5cd45036eb3cfc1e42f63343c6aa63de",
      },
    ],
    formFields: {
      name: {
        id: "avia_1_1",
        name: "avia_1_1",
        label: "Nom",
        placeholder: "Nom*",
        type: "text",
        required: true,
        className: "text_input is_empty",
      },
      phone: {
        id: "avia_2_1",
        name: "avia_2_1",
        label: "Téléphone / WhatsApp",
        placeholder: "Téléphone / WhatsApp*",
        type: "text",
        required: true,
        className: "text_input is_empty",
      },
      email: {
        id: "avia_3_1",
        name: "avia_3_1",
        label: "Email",
        placeholder: "Email",
        type: "text",
        className: "text_input ",
      },
      message: {
        id: "avia_4_1",
        name: "avia_4_1",
        label: "Message",
        placeholder: "Message",
        type: "textarea",
        className: "text_area ",
      },
      honeypot: {
        id: "avia_5_1",
        name: "avia_5_1",
        label: "",
        placeholder: "",
        type: "hidden",
        className: "hidden ",
      },
    },
  },
};

export function getContactPageContent(locale: Locale): ContactPageContent {
  return CONTACT_PAGE_BY_LOCALE[locale];
}
