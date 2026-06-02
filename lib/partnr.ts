const BASE_URL = process.env.PARTNR_BASE_URL!;
const API_KEY = process.env.PARTNR_API_KEY!;

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
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Partnr Error ${response.status}`);
  }

  return response.json();
}