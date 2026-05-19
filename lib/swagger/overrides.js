/** Detailed OpenAPI operation overrides for selected endpoints. */
export const pathOverrides = {
  "/api/v1/auth/login": {
    post: {
      summary: "Admin login",
      description:
        "Authenticates an admin user and returns a base64-encoded token for subsequent API calls.",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginResponse" },
            },
          },
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        422: { $ref: "#/components/responses/ValidationError" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/api/v1/auth/logout": {
    post: {
      summary: "Admin logout",
      description: "Ends the current admin session (client should discard the token).",
      security: [{ bearerAuth: [] }],
    },
  },
  "/api/v1/db-health": {
    get: {
      summary: "Database health check",
      description:
        "Verifies database connectivity and returns masked connection configuration.",
    },
  },
  "/api/v1/home-data": {
    get: {
      summary: "Home page aggregate data",
      description:
        "Returns industries, logos, case studies, testimonials, and award logos for the public home page.",
    },
  },
  "/api/v1/services": {
    post: {
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ServiceCreateRequest" },
          },
        },
      },
    },
  },
  "/api/upload": {
    post: {
      tags: ["Upload"],
      summary: "Upload a file",
      description:
        "Uploads a file to an allowed folder under `uploads/` or `public/`.",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file", "fileName"],
              properties: {
                file: { type: "string", format: "binary" },
                fileName: { type: "string", example: "hero.webp" },
                folder: {
                  type: "string",
                  example: "uploads/images",
                  description: "Target folder under uploads/ or public/",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "File uploaded",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string" },
                  fileName: { type: "string" },
                  path: { type: "string" },
                },
              },
            },
          },
        },
        400: { $ref: "#/components/responses/ValidationError" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
};
