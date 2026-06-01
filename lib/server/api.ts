import type { ServerFetchOptions, ApiSuccessResponse } from "@/types/api";

const DEFAULT_API_URL = "https://cubastionconsulting.com/api/v1";

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
}

function getAuthHeader(): string | undefined {
  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
  if (!username || !password) return undefined;
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

export async function serverFetch<T = unknown>(path: string, options: ServerFetchOptions = {}): Promise<T | null> {
  const baseUrl = getApiBaseUrl();
  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string> || {}),
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

    return await response.json() as T;
  } catch {
    return null;
  }
}

export function unwrapApiData<T = unknown>(json: ApiSuccessResponse<T> | Record<string, unknown> | null | undefined): T | null {
  if (!json) return null;
  if ("data" in json && json.data !== undefined) return json.data as T;
  return json as T;
}
