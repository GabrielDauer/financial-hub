const BASE_URL = process.env.PARTNR_BASE_URL;
const API_KEY = process.env.PARTNR_API_KEY;

if (!BASE_URL) {
  throw new Error("PARTNR_BASE_URL não configurado");
}

if (!API_KEY) {
  throw new Error("PARTNR_API_KEY não configurada");
}

export async function partnrFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${BASE_URL}/${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      cache: "no-store",
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Partnr Error ${response.status}: ${text}`
    );
  }

  return JSON.parse(text);
}