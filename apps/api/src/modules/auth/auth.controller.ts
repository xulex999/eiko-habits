import type { Request, Response } from 'express';
import * as authService from './auth.service.js';

export async function register(req: Request, res: Response) {
  const { email, password, displayName } = req.body;
  const result = await authService.register(email, password, displayName);

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth',
  });

  res.status(201).json({
    success: true,
    data: {
      user: result.user,
      tokens: result.tokens,
    },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  });

  res.json({
    success: true,
    data: {
      user: result.user,
      tokens: result.tokens,
    },
  });
}

export async function refresh(req: Request, res: Response) {
  const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!rawToken) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No refresh token provided' },
    });
    return;
  }

  const result = await authService.refreshAccessToken(rawToken);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  });

  res.json({
    success: true,
    data: { tokens: result.tokens },
  });
}

export async function logout(req: Request, res: Response) {
  const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (rawToken) {
    await authService.logout(rawToken);
  }

  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  res.json({ success: true });
}
