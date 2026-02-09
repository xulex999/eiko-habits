import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.js';

/**
 * Middleware factory that validates request body against a Zod schema.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ValidationError(
          err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        );
      }
      throw err;
    }
  };
}

/**
 * Validate query parameters.
 * Note: In Express 5, req.query is read-only, so we store validated params in req.validatedQuery
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validatedQuery = schema.parse(req.query);
      // Store validated query in a custom property since req.query is read-only in Express 5
      (req as any).validatedQuery = validatedQuery;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ValidationError(
          err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        );
      }
      throw err;
    }
  };
}
