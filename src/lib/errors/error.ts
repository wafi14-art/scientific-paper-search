export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR", details: unknown = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details: unknown = null) {
    super(message, 404, "NOT_FOUND", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access", details: unknown = null) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access", details: unknown = null) {
    super(message, 403, "FORBIDDEN", details);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details: unknown = null) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed", details: unknown = null) {
    super(message, 500, "DATABASE_ERROR", details);
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error encountered:", error);

  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
      statusCode: error.statusCode,
    };
  }

  // Handle Prisma / Database issues gracefully
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code.startsWith("P")
  ) {
    const message = "message" in error && typeof error.message === "string" ? error.message : null;

    return {
      success: false,
      error: {
        message: "A database error occurred.",
        code: "DATABASE_ERROR",
        details: process.env.NODE_ENV === "development" ? message : null,
      },
      statusCode: 500,
    };
  }

  // Fallback
  return {
    success: false,
    error: {
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
      details: null,
    },
    statusCode: 500,
  };
}
