import type { Request, Response, NextFunction } from 'express';
import { PremiumRequiredError } from '../utils/errors.js';

/**
 * Middleware that gates routes behind premium subscription.
 * Must be used after requireAuth.
 */
export function requirePremium(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new PremiumRequiredError();
  }

  if (req.user.tier !== 'PREMIUM') {
    throw new PremiumRequiredError();
  }

  next();
}
