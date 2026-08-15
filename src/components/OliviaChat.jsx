import { useMemo, useState } from "react";

const SITE_CODE = "jeanlouisdavid";
const LEAD_ENDPOINT = "https://www.o7digital.com/api/o7-lead";
const CHAT_ENDPOINT = "https://olivia-ai.o7digital.com/api/olivia/chat";
const CHANNEL_ENDPOINT = "https://olivia-ai.o7digital.com/api/widget/conversations";

const COPY = {
  es: {
    title: "Olivia",
    subtitle: "Asistente Jean Louis David",
    status: "En linea",
    teaser: "Necesitas ayuda?",
    open: "Abrir chat",
    close: "Cerrar chat",
    welcome: "Hola, soy Olivia. En que puedo ayudarte?",
    leadIntro: "Deja tus datos para que un asesor Jean Louis David pueda contactarte.",
    consent: "He leído y acepto el Aviso de Privacidad para recibir atención de Jean Louis David.",
    privacy: "Aviso de Privacidad",
    privacyTitle: "Aviso de Privacidad - Olivia AI",
    privacyBody: "Al usar este chat autorizas a Jean Louis David México a tratar los datos personales que compartas, incluyendo nombre, apellidos, email, teléfono, mensajes, idioma y página visitada, con la finalidad de atender tu solicitud, dar seguimiento a servicios de salón y contactarte por medios electrónicos. Tus datos serán tratados conforme al Aviso de Privacidad del sitio y a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Puedes ejercer derechos ARCO, revocar tu consentimiento o limitar el uso de tus datos conforme al Aviso de Privacidad.",
    privacyAccept: "He leído y acepto",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Email",
    phone: "Telefono",
    submitLead: "Enviar datos",
    leadThanks: "Gracias. Tus datos fueron enviados y un asesor te contactara pronto.",
    placeholder: "Escribe tu pregunta...",
    send: "Enviar",
    error: "No pude enviar el mensaje. Intenta de nuevo o contacta directamente al salon.",
  },
  en: {
    title: "Olivia",
    subtitle: "Jean Louis David Assistant",
    status: "Online",
    teaser: "Need help?",
    open: "Open chat",
    close: "Close chat",
    welcome: "Hello, I am Olivia. How can I help you?",
    leadIntro: "Leave your details so a Jean Louis David advisor can contact you.",
    consent: "I have read and accept the Privacy Notice to receive assistance from Jean Louis David.",
    privacy: "Privacy Notice",
    privacyTitle: "Privacy Notice - Olivia AI",
    privacyBody: "By using this chat, you authorize Jean Louis David Mexico to process the personal data you provide, including first name, last name, email, phone, messages, language and visited page, to answer your request, follow up on salon services and contact you by electronic means. Your data will be processed under the site Privacy Notice and Mexico’s Federal Law on Protection of Personal Data Held by Private Parties. You may exercise ARCO rights, revoke consent or limit data use as described in the Privacy Notice.",
    privacyAccept: "I have read and accept",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    submitLead: "Send details",
    leadThanks: "Thanks. Your details were sent and an advisor will contact you soon.",
    placeholder: "Write your question...",
    send: "Send",
    error: "I could not send the message. Please try again or contact the salon directly.",
  },
  fr: {
    title: "Olivia",
    subtitle: "Assistante Jean Louis David",
    status: "En ligne",
    teaser: "Besoin d'aide ?",
    open: "Ouvrir le chat",
    close: "Fermer le chat",
    welcome: "Bonjour, je suis Olivia. Comment puis-je vous aider ?",
    leadIntro: "Laissez vos coordonnees pour qu'un conseiller Jean Louis David puisse vous contacter.",
    consent: "J’ai lu et j’accepte l’avis de confidentialité pour recevoir l’assistance de Jean Louis David.",
    privacy: "Avis de confidentialité",
    privacyTitle: "Avis de confidentialité - Olivia AI",
    privacyBody: "En utilisant ce chat, vous autorisez Jean Louis David Mexique à traiter les données personnelles que vous partagez, notamment prénom, nom, email, téléphone, messages, langue et page visitée, afin de répondre à votre demande, assurer le suivi des services de salon et vous contacter par voie électronique. Vos données seront traitées conformément à l’avis de confidentialité du site et à la loi mexicaine applicable. Vous pouvez exercer vos droits ARCO, révoquer votre consentement ou limiter l’utilisation de vos données selon l’avis de confidentialité.",
    privacyAccept: "J’ai lu et j’accepte",
    firstName: "Prenom",
    lastName: "Nom",
    email: "Email",
    phone: "Telephone",
    submitLead: "Envoyer",
    leadThanks: "Merci. Vos coordonnees ont ete envoyees et un conseiller vous contactera rapidement.",
    placeholder: "Ecrivez votre question...",
    send: "Envoyer",
    error: "Je n'ai pas pu envoyer le message. Reessayez ou contactez directement le salon.",
  },
};

function getLanguage() {
  const lang = (document.documentElement.lang || "").toLowerCase();
  if (lang.startsWith("fr")) return "fr";
  if (lang.startsWith("en")) return "en";
  return "es";
}

function detectMessageLanguage(message, fallbackLanguage) {
  const value = (message || "").toLowerCase();
  if (!value) return fallbackLanguage;

  const spanishHints = /\b(hola|gracias|quiero|precio|precios|tarifa|tarifas|cita|citas|informacion|contacto|correo|telefono|cabello|servicio|servicios)\b/;
  const frenchHints = /\b(bonjour|merci|prix|tarif|devis|rendez-vous|contact|telephone|cheveux|service|services)\b/;
  const englishHints = /\b(hello|thanks|price|prices|quote|appointment|appointments|contact|phone|hair|service|services)\b/;

  if (spanishHints.test(value)) return "es";
  if (frenchHints.test(value)) return "fr";
  if (englishHints.test(value)) return "en";
  return fallbackLanguage;
}

export default function OliviaChat() {
  const language = typeof document === "undefined" ? "es" : getLanguage();
  const copy = COPY[language];
  const visitorId = useMemo(() => {
    if (typeof window === "undefined") return "";
    const key = `oliviaVisitorId:${SITE_CODE}`;
    const current = window.localStorage.getItem(key) || window.crypto.randomUUID();
    window.localStorage.setItem(key, current);
    return current;
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [consent, setConsent] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [lead, setLead] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [messages, setMessages] = useState([{ role: "assistant", content: copy.welcome }]);

  const transcript = useMemo(
    () => messages.map((message) => `${message.role}: ${message.content}`).join("\n"),
    [messages],
  );

  const channelMetadata = (extra = {}) => ({
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
    pageTitle: typeof document !== "undefined" ? document.title : "",
    source: "Chat Olivia JLD",
    consent,
    consentVersion: "jld-privacy-chat-2026-07-01",
    lead,
    ...extra,
  });

  const storeChannelMessage = async (content, metadata = {}) => {
    if (!visitorId) return null;
    const response = await fetch(CHANNEL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientCode: SITE_CODE,
        visitorId,
        content,
        visitorName: `${lead.firstName} ${lead.lastName}`.trim(),
        email: lead.email,
        phone: lead.phone,
        source: "website-chat",
        language,
        metadata: channelMetadata(metadata),
      }),
    });
    if (!response.ok) throw new Error("Channel Manager delivery failed");
    return response.json();
  };

  const storeAssistantMessage = async (content, model) => {
    if (!visitorId) return;
    await fetch(CHANNEL_ENDPOINT, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientCode: SITE_CODE, visitorId, content, model }),
    });
  };

  const submitLead = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    const payload = {
      firstName: lead.firstName.trim(),
      lastName: lead.lastName.trim(),
      email: lead.email.trim(),
      phone: lead.phone.trim(),
      source: "Chat Olivia JLD",
      language,
      siteCode: SITE_CODE,
      consent: true,
      consentVersion: "jld-privacy-chat-2026-07-01",
      message: `Lead Chat Olivia JLD (${language}, ${SITE_CODE})\n\n${transcript}`,
    };

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone || !consent) return;

    setIsLoading(true);
    try {
      await storeChannelMessage(
        `${payload.firstName} ${payload.lastName} · ${payload.email} · ${payload.phone}`,
        { type: "lead", importedFrom: "jld-chat-form", transcript },
      );

      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) console.warn("Lead delivery failed");
      await storeAssistantMessage(copy.leadThanks);
      setLeadSent(true);
      setMessages((current) => [...current, { role: "assistant", content: copy.leadThanks }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: copy.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || isLoading || !consent) return;
    const messageLanguage = detectMessageLanguage(message, language);

    setInput("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setIsLoading(true);

    try {
      const stored = await storeChannelMessage(message, { type: "message" });
      if (stored?.conversation?.status === "manual") return;

      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          language: messageLanguage,
          clientCode: SITE_CODE,
          clientId: SITE_CODE,
          siteCode: SITE_CODE,
          visitorId,
          metadata: channelMetadata({ transcript }),
          history: messages.slice(-12).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await response.json();
      const assistantContent = data.reply || copy.error;
      setMessages((current) => [...current, { role: "assistant", content: assistantContent }]);
      if (data.action === "show_lead_form" || data.leadForm) setShowLeadForm(true);
      await storeAssistantMessage(assistantContent, data.model);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: copy.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="olivia-chat">
      {isOpen && (
        <section className="olivia-chat__panel" aria-label={copy.subtitle}>
          <header className="olivia-chat__header">
            <div>
              <p className="olivia-chat__title">{copy.title}</p>
              <p className="olivia-chat__subtitle">{copy.subtitle}</p>
            </div>
            <span className="olivia-chat__status">{copy.status}</span>
            <button type="button" className="olivia-chat__close" onClick={() => setIsOpen(false)} aria-label={copy.close}>
              x
            </button>
          </header>

          <div className="olivia-chat__messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`olivia-chat__message olivia-chat__message--${message.role}`}>
                {message.content}
              </div>
            ))}
            {isLoading && <div className="olivia-chat__message olivia-chat__message--assistant">...</div>}
          </div>

          {showLeadForm && !leadSent && (
            <form className="olivia-chat__lead" onSubmit={submitLead}>
              <p>{copy.leadIntro}</p>
              <input required placeholder={copy.firstName} value={lead.firstName} onChange={(event) => setLead((current) => ({ ...current, firstName: event.target.value }))} />
              <input required placeholder={copy.lastName} value={lead.lastName} onChange={(event) => setLead((current) => ({ ...current, lastName: event.target.value }))} />
              <input required type="email" placeholder={copy.email} value={lead.email} onChange={(event) => setLead((current) => ({ ...current, email: event.target.value }))} />
              <input required type="tel" placeholder={copy.phone} value={lead.phone} onChange={(event) => setLead((current) => ({ ...current, phone: event.target.value }))} />
              <label className="olivia-chat__consent">
                <input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                <span>{copy.consent} <button type="button" onClick={() => setPrivacyOpen(true)}>{copy.privacy}</button></span>
              </label>
              <button type="submit" disabled={isLoading || !consent}>{copy.submitLead}</button>
            </form>
          )}

          {!consent && (
            <label className="olivia-chat__consent">
              <input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>{copy.consent} <button type="button" onClick={() => setPrivacyOpen(true)}>{copy.privacy}</button></span>
            </label>
          )}

          <div className="olivia-chat__composer">
            <input
              value={input}
              disabled={!consent || isLoading}
              placeholder={copy.placeholder}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
            />
            <button type="button" onClick={sendMessage} disabled={!consent || isLoading} aria-label={copy.send}>
              &gt;
            </button>
          </div>
        </section>
      )}

      {!isOpen && (
        <button type="button" className="olivia-chat__teaser" onClick={() => setIsOpen(true)}>
          <span className="olivia-chat__avatar">O</span>
          <span>{copy.teaser}</span>
        </button>
      )}

      <button type="button" className="olivia-chat__toggle" onClick={() => setIsOpen((current) => !current)} aria-label={isOpen ? copy.close : copy.open}>
        {isOpen ? "x" : "Olivia"}
      </button>

      {privacyOpen && (
        <div className="olivia-chat__privacy" role="dialog" aria-modal="true" aria-label={copy.privacyTitle}>
          <div>
            <button type="button" className="olivia-chat__privacy-close" onClick={() => setPrivacyOpen(false)} aria-label={copy.close}>x</button>
            <h3>{copy.privacyTitle}</h3>
            <p>{copy.privacyBody}</p>
            <a href="/privacidad/" target="_blank" rel="noreferrer">{copy.privacy}</a>
            <button type="button" onClick={() => { setConsent(true); setPrivacyOpen(false); }}>{copy.privacyAccept}</button>
          </div>
        </div>
      )}
    </div>
  );
}
