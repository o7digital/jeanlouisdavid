const LEAD_ENDPOINT = "https://formspree.io/f/xkovvbwz";

export function isBookingRequest(message) {
  const text = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return /\b(citas?|agendar|reservar|reservacion(?:es)?|reserva(?:s)?|appointments?|book(?:ing)?|reservation(?:s)?|reserver|rdv)\b|\brendez[\s-]?vous\b/.test(text);
}

export async function submitBookingLead(payload, fetcher = fetch) {
  const response = await fetcher(LEAD_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      _subject: "Solicitud de cita - Olivia - Jean Louis David México",
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Lead delivery failed");
  const result = await response.json();
  if (result.ok !== true) throw new Error("Formspree delivery failed");
}
