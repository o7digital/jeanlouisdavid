const API_URL = "https://olivia-ai.o7digital.com/api";
export const SITE_CODE = "jeanlouisdavid";

// The identity is a public, origin-scoped widget capability issued by Olivia.
export function createOliviaClient(fetcher = (...args) => fetch(...args)) {
  let identityPromise;
  let expiresAt = 0;

  async function getIdentity() {
    if (!identityPromise || Date.now() >= expiresAt) {
      expiresAt = Date.now() + 50 * 60 * 1000;
      identityPromise = (async () => {
        const response = await fetcher(`${API_URL}/widget/identity`, {
          cache: "no-store",
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error("Widget identity unavailable");
        const data = await response.json();
        if (data.clientCode !== SITE_CODE || typeof data.identity !== "string" || !data.identity) {
          throw new Error("Invalid widget identity");
        }
        return data.identity;
      })().catch((error) => {
        identityPromise = undefined;
        throw error;
      });
    }
    return identityPromise;
  }

  return async function request(path, method, payload) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const identity = await getIdentity();
      const response = await fetcher(`${API_URL}/${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Olivia-Widget-Identity": identity,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(45000),
      });
      if (response.status === 401 && attempt === 0) {
        identityPromise = undefined;
        continue;
      }
      if (!response.ok) throw new Error(`Olivia delivery failed (${response.status})`);
      const data = await response.json();
      if (data.error || data.ok === false) throw new Error("Olivia delivery failed");
      return data;
    }
  };
}

export const requestOlivia = createOliviaClient();
