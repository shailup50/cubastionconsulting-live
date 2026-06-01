export interface ApiSuccessResponse<T = unknown> {
  status: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  status: false;
  message: string;
  error?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export type RouteContext<P extends Record<string, string> = Record<string, string>> = {
  params: Promise<P>;
};

export interface IdParams { id: string }
export interface UrlParams { url: string }
export interface SlugParams { slug: string }
export interface TypeParams { type: string }

export interface ServerFetchOptions extends RequestInit {
  next?: { revalidate?: number };
}
