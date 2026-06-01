export const schemas: Record<string, Record<string, unknown>> = {
  ApiSuccessResponse: {
    type: "object",
    properties: {
      status: { type: "boolean", example: true },
      message: { type: "string" },
      data: {},
    },
    required: ["status"],
  },
  ApiErrorResponse: {
    type: "object",
    properties: {
      status: { type: "boolean", example: false },
      message: { type: "string" },
      error: { type: "string" },
    },
    required: ["status", "message"],
  },
  LoginRequest: {
    type: "object",
    required: ["UserName", "Passwords"],
    properties: {
      UserName: { type: "string", example: "admin" },
      Passwords: { type: "string", format: "password", example: "password" },
    },
  },
  LoginResponse: {
    type: "object",
    properties: {
      status: { type: "boolean", example: true },
      message: { type: "string", example: "Login successful" },
      token: { type: "string", description: "Base64-encoded session token" },
      user: {
        type: "object",
        properties: {
          loginID: { type: "integer" },
          UserName: { type: "string" },
        },
      },
    },
  },
  ServiceCreateRequest: {
    type: "object",
    required: [
      "ServiceName",
      "ServiceNameURL",
      "ServiceImage",
      "DisplayOrder",
      "ActiveStatus",
    ],
    properties: {
      ServiceName: { type: "string" },
      ServiceNameURL: { type: "string" },
      ServiceImage: { type: "string" },
      ServiceBannerImage: { type: "string" },
      ServiceBannerImage1: { type: "string" },
      ServiceTagLine: { type: "string" },
      ServicePunchline: { type: "string" },
      DescriptionHeading: { type: "string" },
      Description: { type: "string" },
      OtherDescriptionHeading: { type: "string" },
      OtherDescription: { type: "string" },
      DisplayOrder: { type: "integer" },
      ActiveStatus: { type: "integer", enum: [0, 1] },
      MetaTitle: { type: "string" },
      MetaKeywords: { type: "string" },
      MetaDescriptions: { type: "string" },
      MetaSchema: { type: "string" },
      MetaOgImage: { type: "string" },
    },
  },
  GenericJsonBody: {
    type: "object",
    additionalProperties: true,
    description: "Request body fields vary by resource. See route handlers for full field lists.",
  },
  ContactSiebelExpertCreateRequest: {
    type: "object",
    required: ["firstName", "email"],
    properties: {
      firstName: { type: "string", example: "Jane" },
      lastName: { type: "string", example: "Doe" },
      email: { type: "string", format: "email", example: "jane.doe@company.com" },
      company: { type: "string", example: "Acme Corp" },
      service: {
        type: "string",
        example: "Siebel Upgrade & Modernisation",
      },
      version: { type: "string", example: "Siebel 2021+" },
      first_name: { type: "string", description: "Snake_case alias for firstName" },
      last_name: { type: "string", description: "Snake_case alias for lastName" },
    },
  },
  ContactSiebelExpert: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      first_name: { type: "string" },
      last_name: { type: "string", nullable: true },
      email: { type: "string", format: "email" },
      company: { type: "string", nullable: true },
      service: { type: "string", nullable: true },
      version: { type: "string", nullable: true },
      created_at: { type: "string", format: "date-time" },
    },
  },
  ContactTechCoFounderCreateRequest: {
    type: "object",
    required: ["name", "email", "idea"],
    properties: {
      name: { type: "string", example: "Alex Founder" },
      email: { type: "string", format: "email", example: "alex@startup.io" },
      idea: {
        type: "string",
        example: "AI-powered CRM for SMBs with mobile-first UX",
        description: "Mapped to idea_description in the database",
      },
      idea_description: { type: "string", description: "Snake_case alias for idea" },
      ideaDescription: { type: "string", description: "CamelCase alias for idea" },
    },
  },
  ContactTechCoFounder: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      idea_description: { type: "string" },
    },
  },
};

export const commonResponses: Record<string, Record<string, unknown>> = {
  Success: {
    description: "Successful operation",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ApiSuccessResponse" },
      },
    },
  },
  Created: {
    description: "Resource created",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ApiSuccessResponse" },
      },
    },
  },
  ValidationError: {
    description: "Validation error",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ApiErrorResponse" },
      },
    },
  },
  NotFound: {
    description: "Resource not found",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ApiErrorResponse" },
      },
    },
  },
  Unauthorized: {
    description: "Unauthorized",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ApiErrorResponse" },
      },
    },
  },
  ServerError: {
    description: "Internal server error",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ApiErrorResponse" },
      },
    },
  },
};
