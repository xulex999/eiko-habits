import type { Request, Response } from 'express';
import * as goalsService from './goals.service.js';

export async function listGoals(req: Request, res: Response) {
  const result = await goalsService.listGoals(req.user!.id, (req as any).validatedQuery || req.query);
  res.json({ success: true, data: result.goals, meta: result.meta });
}

export async function createGoal(req: Request, res: Response) {
  const data = await goalsService.createGoal(req.user!.id, req.body);
  res.status(201).json({ success: true, data });
}

export async function getGoal(req: Request, res: Response) {
  const data = await goalsService.getGoal(req.user!.id, req.params.id);
  res.json({ success: true, data });
}

export async function updateGoal(req: Request, res: Response) {
  const data = await goalsService.updateGoal(req.user!.id, req.params.id, req.body);
  res.json({ success: true, data });
}

export async function deleteGoal(req: Request, res: Response) {
  await goalsService.deleteGoal(req.user!.id, req.params.id);
  res.json({ success: true });
}

export async function updateProgress(req: Request, res: Response) {
  const data = await goalsService.updateProgress(req.user!.id, req.params.id, req.body.currentValue);
  res.json({ success: true, data });
}

export async function completeGoal(req: Request, res: Response) {
  const data = await goalsService.completeGoal(req.user!.id, req.params.id);
  res.json({ success: true, data });
}
