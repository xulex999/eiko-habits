import type { Request, Response } from 'express';
import * as habitsService from './habits.service.js';

export async function listHabits(req: Request, res: Response) {
  const result = await habitsService.listHabits(req.user!.id, req.query as any);
  res.json({ success: true, data: result.habits, meta: result.meta });
}

export async function createHabit(req: Request, res: Response) {
  const data = await habitsService.createHabit(req.user!.id, req.body);
  res.status(201).json({ success: true, data });
}

export async function getTodaysHabits(req: Request, res: Response) {
  const data = await habitsService.getTodaysHabits(req.user!.id);
  res.json({ success: true, data });
}

export async function batchCheckIn(req: Request, res: Response) {
  const data = await habitsService.batchCheckIn(req.user!.id, req.body);
  res.json({ success: true, data });
}

export async function getHabit(req: Request, res: Response) {
  const data = await habitsService.getHabit(req.user!.id, req.params.id);
  res.json({ success: true, data });
}

export async function updateHabit(req: Request, res: Response) {
  const data = await habitsService.updateHabit(req.user!.id, req.params.id, req.body);
  res.json({ success: true, data });
}

export async function deleteHabit(req: Request, res: Response) {
  await habitsService.deleteHabit(req.user!.id, req.params.id);
  res.json({ success: true });
}

export async function checkIn(req: Request, res: Response) {
  const data = await habitsService.checkIn(req.user!.id, req.params.id, req.body);
  res.json({ success: true, data });
}

export async function undoCheckIn(req: Request, res: Response) {
  await habitsService.undoCheckIn(req.user!.id, req.params.id, req.params.date);
  res.json({ success: true });
}

export async function getHistory(req: Request, res: Response) {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const perPage = req.query.perPage ? Number(req.query.perPage) : undefined;
  const result = await habitsService.getHistory(req.user!.id, req.params.id, page, perPage);
  res.json({ success: true, data: result.logs, meta: result.meta });
}

export async function getStats(req: Request, res: Response) {
  const data = await habitsService.getStats(req.user!.id, req.params.id);
  res.json({ success: true, data });
}
