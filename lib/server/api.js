const DEFAULT_API_URL = "https://cubastionconsulting.com/api/v1";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
}

function getAuthHeader() {
  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
  if (!username || !password) return undefined;
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

/**
 * Server-side fetch for Next.js App Router pages.
 * @param {string} path - API path e.g. `/home-data` or full URL
 * @param {RequestInit & { next?: { revalidate?: number } }} [options]
 */
export async function serverFetch(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  const auth = getAuthHeader();
  if (auth) {
    headers.Authorization = auth;
  }

  const { next, ...fetchOptions } = options;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      next: next ?? { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

/** @param {Record<string, unknown> | null | undefined} json */
export function unwrapApiData(json) {
  if (!json) return null;
  if (json.data !== undefined) return json.data;
  return json;
}
