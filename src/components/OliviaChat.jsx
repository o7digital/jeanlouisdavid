import { useMemo, useState } from "react";

const SITE_CODE = "jeanlouisdavid";
const LEAD_ENDPOINT = "https://www.o7digital.com/api/o7-lead";
const CHAT_ENDPOINT = "https://www.o7digital.com/api/o7-chat";

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
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [lead, setLead] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [messages, setMessages] = useState([{ role: "assistant", content: copy.welcome }]);

  const transcript = useMemo(
    () => messages.map((message) => `${message.role}: ${message.content}`).join("\n"),
    [messages],
  );

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
      message: `Lead Chat Olivia JLD (${language}, ${SITE_CODE})\n\n${transcript}`,
    };

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone) return;

    setIsLoading(true);
    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Lead delivery failed");

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
    if (!message || isLoading || !leadSent) return;
    const messageLanguage = detectMessageLanguage(message, language);

    setInput("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language: messageLanguage, siteCode: SITE_CODE }),
      });
      const data = await response.json();
      setMessages((current) => [...current, { role: "assistant", content: data.reply || copy.error }]);
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

          {!leadSent && (
            <form className="olivia-chat__lead" onSubmit={submitLead}>
              <p>{copy.leadIntro}</p>
              <input required placeholder={copy.firstName} value={lead.firstName} onChange={(event) => setLead((current) => ({ ...current, firstName: event.target.value }))} />
              <input required placeholder={copy.lastName} value={lead.lastName} onChange={(event) => setLead((current) => ({ ...current, lastName: event.target.value }))} />
              <input required type="email" placeholder={copy.email} value={lead.email} onChange={(event) => setLead((current) => ({ ...current, email: event.target.value }))} />
              <input required type="tel" placeholder={copy.phone} value={lead.phone} onChange={(event) => setLead((current) => ({ ...current, phone: event.target.value }))} />
              <button type="submit" disabled={isLoading}>{copy.submitLead}</button>
            </form>
          )}

          <div className="olivia-chat__composer">
            <input
              value={input}
              disabled={!leadSent || isLoading}
              placeholder={copy.placeholder}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
            />
            <button type="button" onClick={sendMessage} disabled={!leadSent || isLoading} aria-label={copy.send}>
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
    </div>
  );
}
