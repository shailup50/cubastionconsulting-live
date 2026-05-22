import { generatePaths } from "./generate-paths.js";
import { pathOverrides } from "./overrides.js";
import { commonResponses, schemas } from "./schemas.js";

/** Base URL for Try-it-out (no /api/v1 suffix). */
function resolveServerUrlFallback() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    return String(apiUrl)
      .trim()
      .replace(/\/api\/v1\/?$/i, "")
      .replace(/\/$/, "");
  }

  const fromEnv =
    process.env.NEXT_PUBLIC_CANONICAL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL;
  if (!fromEnv) {
    return "https://cubastionconsulting.com";
  }
  const trimmed = String(fromEnv).trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Prefer the host that served Swagger UI so Try-it-out uses the same scheme (HTTPS/HTTP).
 * Avoids mixed-content when the page is HTTPS but env points at an HTTP server URL.
 */
export function getRequestOrigin(request) {
  if (!request?.url) return null;
  try {
    const url = new URL(request.url);
    const host =
      request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      request.headers.get("host") ||
      url.host;
    const proto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
      url.protocol.replace(":", "");
    return `${proto}://${host}`;
  } catch {
    return null;
  }
}

export function getOpenApiSpec(request) {
  const paths = generatePaths(pathOverrides);
  const tags = [
    ...new Set(
      Object.values(paths).flatMap((pathItem) =>
        Object.values(pathItem).flatMap((operation) => operation.tags || []),
      ),
    ),
  ]
    .sort()
    .map((name) => ({ name }));

  return {
    openapi: "3.0.3",
    info: {
      title: "Cubastion Consulting API",
      version: "1.0.0",
      description:
        "REST API for the Cubastion Consulting Next.js application. Use **Authorize** with the token returned from `POST /api/v1/auth/login`.",
      contact: {
        name: "Cubastion Consulting",
        url: "https://cubastionconsulting.com",
      },
    },
    servers: [
      {
        url: getRequestOrigin(request) || resolveServerUrlFallback(),
        description: "Current host (same origin as this admin session)",
      },
    ],
    tags,
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "token",
          description:
            "Token from POST /api/v1/auth/login (paste the raw token value).",
        },
      },
      schemas,
      responses: commonResponses,
    },
    security: [{ bearerAuth: [] }],
  };
}
