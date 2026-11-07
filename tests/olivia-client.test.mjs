import test from "node:test";
import assert from "node:assert/strict";
import { createOliviaClient, SITE_CODE } from "../src/lib/olivia-client.mjs";

const json = (body, status = 200) => Response.json(body, { status });

test("obtains one JLD identity and authenticates conversation, chat and assistant requests", async () => {
  const calls = [];
  const request = createOliviaClient(async (url, options) => {
    calls.push({ url, ...options });
    return url.endsWith("/identity")
      ? json({ clientCode: SITE_CODE, identity: "jld-token" })
      : json({ ok: true });
  });
  await request("widget/conversations", "POST", { content: "Hola" });
  await request("olivia/chat", "POST", { message: "Hola" });
  await request("widget/conversations", "PATCH", { content: "Bienvenido" });
  assert.equal(calls.length, 4);
  assert.equal(calls[0].cache, "no-store");
  for (const call of calls.slice(1)) {
    assert.equal(call.headers["X-Olivia-Widget-Identity"], "jld-token");
    assert.ok(call.signal instanceof AbortSignal);
  }
  assert.equal(calls[3].method, "PATCH");
});

test("refreshes a rejected identity once and retries with the new token", async () => {
  let identities = 0;
  const tokens = [];
  const request = createOliviaClient(async (url, options) => {
    if (url.endsWith("/identity")) return json({ clientCode: SITE_CODE, identity: `token-${++identities}` });
    tokens.push(options.headers["X-Olivia-Widget-Identity"]);
    return tokens.length === 1 ? json({ error: "Invalid widget identity" }, 401) : json({ reply: "Hola" });
  });
  assert.deepEqual(await request("olivia/chat", "POST", {}), { reply: "Hola" });
  assert.deepEqual(tokens, ["token-1", "token-2"]);
});

test("does not loop when authentication still fails", async () => {
  let attempts = 0;
  const request = createOliviaClient(async (url) => {
    if (url.endsWith("/identity")) return json({ clientCode: SITE_CODE, identity: "token" });
    attempts += 1;
    return json({ error: "Invalid widget identity" }, 401);
  });
  await assert.rejects(request("olivia/chat", "POST", {}), /401/);
  assert.equal(attempts, 2);
});

test("rejects identities belonging to another site before sending visitor data", async () => {
  let calls = 0;
  const request = createOliviaClient(async () => {
    calls += 1;
    return json({ clientCode: "other-site", identity: "other-token" });
  });
  await assert.rejects(request("widget/conversations", "POST", {}), /Invalid widget identity/);
  assert.equal(calls, 1);
});

test("a failed identity request can be retried", async () => {
  let identities = 0;
  const request = createOliviaClient(async (url) => {
    if (!url.endsWith("/identity")) return json({ ok: true });
    if (++identities === 1) throw new Error("Network unavailable");
    return json({ clientCode: SITE_CODE, identity: "token" });
  });
  await assert.rejects(request("widget/conversations", "POST", {}), /Network unavailable/);
  assert.deepEqual(await request("widget/conversations", "POST", {}), { ok: true });
});

test("rejects HTTP and application errors instead of reporting success", async () => {
  for (const response of [json({}, 502), json({ ok: false }), json({ error: "Unavailable" })]) {
    const request = createOliviaClient(async (url) => url.endsWith("/identity")
      ? json({ clientCode: SITE_CODE, identity: "token" }) : response);
    await assert.rejects(request("widget/conversations", "POST", {}), /delivery failed/);
  }
});
