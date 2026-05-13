type DatoError = {
  message?: string;
};

type DatoResponse<T> = {
  data?: T;
  errors?: DatoError[];
};

const DATOCMS_ENDPOINT = "https://graphql.datocms.com/";

function getEnv(name: string): string | undefined {
  return import.meta.env[name] ?? process.env[name];
}

export function logDatoCmsDebug(message: string, details?: Record<string, unknown>): void {
  if (getEnv("DEBUG_DATOCMS") !== "1") {
    return;
  }

  console.warn(`[DatoCMS] ${message}`, details ?? "");
}

export function hasDatoCmsToken(): boolean {
  return Boolean(getEnv("DATOCMS_API_TOKEN"));
}

export async function datoRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  const token = getEnv("DATOCMS_API_TOKEN");
  const environment = getEnv("DATOCMS_ENVIRONMENT");

  console.warn("[DatoCMS] build config", {
    environment: environment || "primary",
    hasToken: Boolean(token),
  });

  if (!token) {
    logDatoCmsDebug("missing DATOCMS_API_TOKEN");
    return null;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  if (environment) {
    headers["X-Environment"] = environment;
  }

  logDatoCmsDebug("request", {
    environment: environment || "primary",
    hasToken: true,
    variables,
  });

  try {
    const response = await fetch(DATOCMS_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.warn(`DatoCMS request failed: ${response.status} ${response.statusText}`);
      logDatoCmsDebug("http error", {
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    const payload = (await response.json()) as DatoResponse<T>;

    if (payload.errors?.length) {
      console.warn(`DatoCMS request failed: ${payload.errors.map((error) => error.message).join(", ")}`);
      logDatoCmsDebug("graphql errors", {
        errors: payload.errors.map((error) => error.message),
      });
      return null;
    }

    logDatoCmsDebug("response ok");
    return payload.data ?? null;
  } catch (error) {
    console.warn("DatoCMS request failed:", error);
    logDatoCmsDebug("request exception", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
