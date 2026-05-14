import { NextResponse } from "next/server";

function normalizeOrigin(origin) {
  return String(origin || "").trim().replace(/\/$/, "");
}

function allowedOriginsList() {
  const fromCsv = (process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
  if (fromCsv.length) return fromCsv;
  const canonical = normalizeOrigin(process.env.NEXT_PUBLIC_CANONICAL_URL);
  return canonical ? [canonical] : [];
}

function pickAllowOrigin(request) {
  const origin = normalizeOrigin(request.headers.get("origin"));
  if (!origin) return null;
  const allowed = allowedOriginsList();
  if (allowed.length === 0) {
    if (process.env.NODE_ENV === "development") return origin;
    return null;
  }
  return allowed.includes(origin) ? origin : null;
}

function applyCors(request, response) {
  const allow = pickAllowOrigin(request);
  if (allow) {
    response.headers.set("Access-Control-Allow-Origin", allow);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Vary", "Origin");
  }
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, X-Requested-With",
  );
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export function middleware(request) {
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (request.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    return applyCors(request, res);
  }

  return applyCors(request, NextResponse.next());
}

export const config = {
  matcher: "/api/:path*",
};
