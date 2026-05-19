export const schemas = {
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
};

export const commonResponses = {
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
