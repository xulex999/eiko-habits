export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown[],
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown[]) {
    super(400, 'VALIDATION_ERROR', 'Validation failed', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}

export class PremiumRequiredError extends AppError {
  constructor() {
    super(403, 'PREMIUM_REQUIRED', 'This feature requires an Eiko Habits Premium subscription');
  }
}

export class LimitReachedError extends AppError {
  constructor(resource: string, limit: number) {
    super(403, 'LIMIT_REACHED', `Free tier limit: maximum ${limit} active ${resource}. Upgrade to Premium for unlimited.`);
  }
}
