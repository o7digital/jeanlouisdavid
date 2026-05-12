type DatoError = {
  message?: string;
};

type DatoResponse<T> = {
  data?: T;
  errors?: DatoError[];
};

const DATOCMS_ENDPOINT = "https://graphql.datocms.com/";

export function hasDatoCmsToken(): boolean {
  return Boolean(import.meta.env.DATOCMS_API_TOKEN);
}

export async function datoRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  const token = import.meta.env.DATOCMS_API_TOKEN;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(DATOCMS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.warn(`DatoCMS request failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const payload = (await response.json()) as DatoResponse<T>;

    if (payload.errors?.length) {
      console.warn(`DatoCMS request failed: ${payload.errors.map((error) => error.message).join(", ")}`);
      return null;
    }

    return payload.data ?? null;
  } catch (error) {
    console.warn("DatoCMS request failed:", error);
    return null;
  }
}

