import type { Request, Response } from 'express';
import * as usersService from './users.service.js';

export async function getProfile(req: Request, res: Response) {
  const data = await usersService.getProfile(req.user!.id);
  res.json({ success: true, data });
}

export async function updateProfile(req: Request, res: Response) {
  const data = await usersService.updateProfile(req.user!.id, req.body);
  res.json({ success: true, data });
}

export async function deleteAccount(req: Request, res: Response) {
  await usersService.deleteAccount(req.user!.id);
  res.json({ success: true });
}

export async function submitOnboarding(req: Request, res: Response) {
  const data = await usersService.submitOnboarding(req.user!.id, req.body);
  res.status(201).json({ success: true, data });
}

export async function getOnboarding(req: Request, res: Response) {
  const data = await usersService.getOnboarding(req.user!.id);
  res.json({ success: true, data });
}

export async function updateNotifications(req: Request, res: Response) {
  const data = await usersService.updateNotifications(req.user!.id, req.body);
  res.json({ success: true, data });
}

export async function getNotifications(req: Request, res: Response) {
  const data = await usersService.getNotifications(req.user!.id);
  res.json({ success: true, data });
}

export async function registerDevice(req: Request, res: Response) {
  const data = await usersService.registerDevice(req.user!.id, req.body);
  res.status(201).json({ success: true, data });
}

export async function removeDevice(req: Request, res: Response) {
  await usersService.removeDevice(req.user!.id, req.params.id);
  res.json({ success: true });
}
