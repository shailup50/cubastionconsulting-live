import { generatePaths } from "./generate-paths.js";
import { pathOverrides } from "./overrides.js";
import { commonResponses, schemas } from "./schemas.js";

function resolveServerUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_CANONICAL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL;
  if (!fromEnv) {
    return "http://148.72.245.39:3001";
  }
  const trimmed = String(fromEnv).trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function getOpenApiSpec() {
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
        url: resolveServerUrl(),
        description: "Current environment",
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
