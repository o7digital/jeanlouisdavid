import test from "node:test";
import assert from "node:assert/strict";
import { isBookingRequest, submitBookingLead } from "../src/lib/olivia-booking.mjs";

test("recognizes appointment requests in Spanish, French and English", () => {
  for (const message of [
    "Quiero una cita mañana en Polanco",
    "¿Puedo agendar un corte?",
    "Quisiera hacer una reservación",
    "Je voudrais un rendez-vous",
    "Un rendez vous demain ?",
    "Je veux réserver pour vendredi",
    "Est-ce possible de prendre un rdv ?",
    "Can I book a haircut?",
    "I would like an appointment",
  ]) assert.equal(isBookingRequest(message), true, message);

  for (const message of ["Hola", "Merci", "What are your prices?", "Your Facebook page?"]) {
    assert.equal(isBookingRequest(message), false, message);
  }
});

test("sends the full request directly to the JLD Formspree form", async () => {
  const payload = {
    firstName: "Ana",
    lastName: "Test",
    email: "ana@example.com",
    phone: "+525500000000",
    message: "assistant: Hola\nuser: Quiero una cita mañana & coloración",
    consent: true,
    siteCode: "jeanlouisdavid",
  };
  let calls = 0;
  await submitBookingLead(payload, async (url, options) => {
    calls += 1;
    assert.equal(url, "https://formspree.io/f/xkovvbwz");
    assert.equal(options.method, "POST");
    assert.equal(options.headers.Accept, "application/json");
    assert.ok(options.signal instanceof AbortSignal);
    const body = JSON.parse(options.body);
    assert.equal(body.message, payload.message);
    assert.equal(body.email, payload.email);
    assert.equal(body.phone, payload.phone);
    assert.equal(body.consent, true);
    assert.match(body._subject, /Jean Louis David/);
    return Response.json({ ok: true });
  });
  assert.equal(calls, 1);
});

test("can forward an appointment request before contact details are collected", async () => {
  await submitBookingLead({ message: "user: Quiero una cita", visitorId: "visitor-test" }, async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.message, "user: Quiero una cita");
    assert.equal(body.visitorId, "visitor-test");
    assert.equal(Object.hasOwn(body, "email"), false);
    return Response.json({ ok: true });
  });
});

test("never reports success for HTTP errors, rejected submissions or network errors", async () => {
  for (const response of [Response.json({}, { status: 429 }), Response.json({ ok: false }), Response.json({ errors: [{ message: "Invalid email" }] })]) {
    await assert.rejects(submitBookingLead({ message: "test" }, async () => response), /delivery failed/);
  }
  await assert.rejects(submitBookingLead({ message: "test" }, async () => { throw new Error("Network unavailable"); }), /Network unavailable/);
});
