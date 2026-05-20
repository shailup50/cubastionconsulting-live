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
  "/api/v1/contact-siebel-expert": {
    get: {
      tags: ["Leads"],
      summary: "List Siebel expert contact enquiries",
      description:
        "Returns all submissions from the Siebel Services hero form (`contact_siebel_expert` table), newest first. Intended for admin use.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "List of enquiries",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "boolean", example: true },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/ContactSiebelExpert" },
                  },
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    post: {
      tags: ["Leads"],
      summary: "Submit Siebel expert contact form",
      description:
        "Public endpoint used by `/siebel-services` hero banner. Persists to `contact_siebel_expert`. Accepts camelCase (`firstName`) or snake_case (`first_name`) field names.",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ContactSiebelExpertCreateRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Enquiry created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "boolean", example: true },
                  message: { type: "string" },
                  data: { $ref: "#/components/schemas/ContactSiebelExpert" },
                },
              },
            },
          },
        },
        422: { $ref: "#/components/responses/ValidationError" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/api/v1/contact-siebel-expert/{id}": {
    get: {
      tags: ["Leads"],
      summary: "Get Siebel expert enquiry by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: {
          description: "Enquiry record",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/ContactSiebelExpert" },
                },
              },
            },
          },
        },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    delete: {
      tags: ["Leads"],
      summary: "Delete Siebel expert enquiry",
      description: "Removes a row from `contact_siebel_expert` by ID.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: {
          description: "Deleted",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiSuccessResponse" },
            },
          },
        },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
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
