import fs from "fs";
import path from "path";

const METHOD_ORDER = ["get", "post", "put", "patch", "delete"] as const;

interface OpenApiOperation {
  tags?: string[];
  summary?: string;
  parameters?: Record<string, unknown>[];
  requestBody?: Record<string, unknown>;
  responses?: Record<string, unknown>;
  security?: Record<string, unknown>[];
  description?: string;
  [key: string]: unknown;
}

type PathItem = Record<string, OpenApiOperation>;
type PathOverrides = Record<string, Record<string, Partial<OpenApiOperation>>>;

function walkRouteFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkRouteFiles(fullPath, acc);
    } else if (entry.name === "route.js" || entry.name === "route.ts") {
      acc.push(fullPath);
    }
  }
  return acc;
}

function filePathToOpenApiPath(filePath: string): string {
  const relative = path
    .relative(path.join(process.cwd(), "app", "api"), filePath)
    .replace(/\\/g, "/")
    .replace(/\/route\.(js|ts)$/, "");
  return `/api/${relative.replace(/\[([^\]]+)\]/g, "{$1}")}`;
}

function getMethods(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf8");
  return [
    ...content.matchAll(/export async function (GET|POST|PUT|PATCH|DELETE)/g),
  ].map((match) => match[1].toLowerCase());
}

function tagFromOpenApiPath(openApiPath: string): string {
  if (openApiPath === "/api/upload") return "Upload";
  const segments = openApiPath.replace(/^\/api\/v1\//, "").split("/");
  const root = segments[0] || "API";
  const tagMap: Record<string, string> = {
    auth: "Auth",
    "db-health": "System",
    "home-data": "Public Data",
    "header-data": "Public Data",
    "about-us-data": "Public Data",
    "pages-meta": "Pages",
  };
  if (tagMap[root]) return tagMap[root];
  return root
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function humanizeSegment(segment: string): string {
  return segment
    .replace(/[{}]/g, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function operationSummary(openApiPath: string, method: string): string {
  const segments = openApiPath.split("/").filter(Boolean);
  const resource = humanizeSegment(segments[segments.length - 1] || "resource");
  const hasPathParam = openApiPath.includes("{");

  const verbs: Record<string, string> = {
    get: hasPathParam ? `Get ${resource}` : `List ${resource}`,
    post: `Create ${resource}`,
    put: `Update ${resource}`,
    patch: `Patch ${resource}`,
    delete: `Delete ${resource}`,
  };
  return verbs[method] || `${method.toUpperCase()} ${resource}`;
}

function pathParameters(openApiPath: string): Record<string, unknown>[] {
  const matches = [...openApiPath.matchAll(/\{([^}]+)\}/g)];
  return matches.map((match) => ({
    name: match[1],
    in: "path",
    required: true,
    schema: { type: "string" },
    description: `${humanizeSegment(match[1])} identifier`,
  }));
}

function defaultOperation(openApiPath: string, method: string): OpenApiOperation {
  const operation: OpenApiOperation = {
    tags: [tagFromOpenApiPath(openApiPath)],
    summary: operationSummary(openApiPath, method),
    parameters: pathParameters(openApiPath),
    responses: {
      200: { $ref: "#/components/responses/Success" },
      404: { $ref: "#/components/responses/NotFound" },
      500: { $ref: "#/components/responses/ServerError" },
    },
  };

  if (method === "post") {
    operation.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/GenericJsonBody" },
        },
      },
    };
    operation.responses = {
      201: { $ref: "#/components/responses/Created" },
      422: { $ref: "#/components/responses/ValidationError" },
      500: { $ref: "#/components/responses/ServerError" },
    };
  }

  if (method === "put" || method === "patch") {
    operation.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/GenericJsonBody" },
        },
      },
    };
    operation.responses = {
      200: { $ref: "#/components/responses/Success" },
      404: { $ref: "#/components/responses/NotFound" },
      422: { $ref: "#/components/responses/ValidationError" },
      500: { $ref: "#/components/responses/ServerError" },
    };
  }

  if (method === "delete") {
    operation.responses = {
      200: { $ref: "#/components/responses/Success" },
      404: { $ref: "#/components/responses/NotFound" },
      500: { $ref: "#/components/responses/ServerError" },
    };
  }

  return operation;
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = output[key];
    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      output[key] = deepMerge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>);
    } else {
      output[key] = sourceValue;
    }
  }
  return output;
}

export function generatePaths(overrides: PathOverrides = {}): Record<string, PathItem> {
  const apiRoot = path.join(process.cwd(), "app", "api");
  const routeFiles = walkRouteFiles(apiRoot).sort();
  const paths: Record<string, PathItem> = {};

  for (const filePath of routeFiles) {
    if (filePath.includes(`${path.sep}docs${path.sep}`)) continue;

    const openApiPath = filePathToOpenApiPath(filePath);
    const methods = getMethods(filePath);
    paths[openApiPath] = paths[openApiPath] || {};

    for (const method of methods) {
      const base = defaultOperation(openApiPath, method);
      const override =
        overrides[openApiPath] && overrides[openApiPath][method]
          ? overrides[openApiPath][method]
          : {};
      paths[openApiPath][method] = deepMerge(base as Record<string, unknown>, override as Record<string, unknown>) as OpenApiOperation;
    }

    const orderedMethods: PathItem = {};
    for (const method of METHOD_ORDER) {
      if (paths[openApiPath][method]) {
        orderedMethods[method] = paths[openApiPath][method];
      }
    }
    paths[openApiPath] = orderedMethods;
  }

  return paths;
}
