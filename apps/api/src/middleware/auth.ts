import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';
import { UnauthorizedError } from '../utils/errors.js';

export interface AuthPayload {
  sub: string; // userId
  tier: 'FREE' | 'PREMIUM';
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        tier: 'FREE' | 'PREMIUM';
      };
    }
  }
}

/**
 * Middleware that verifies the JWT access token and attaches user info to request.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = {
      id: payload.sub,
      tier: payload.tier,
    };

    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError('Invalid or expired token');
  }
}
