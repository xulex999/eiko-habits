import type { Request, Response } from 'express';
import * as aiService from './ai.service.js';

export async function getRecommendations(req: Request, res: Response) {
  const recs = await aiService.getRecommendations(req.user!.id);
  res.json({ success: true, data: recs });
}

export async function dismissRecommendation(req: Request, res: Response) {
  await aiService.dismissRecommendation(req.user!.id, req.params.id);
  res.json({ success: true });
}

export async function generateHabitRoutine(req: Request, res: Response) {
  const rec = await aiService.generateHabitRoutine(req.user!.id, req.body);
  res.json({ success: true, data: rec });
}

export async function generateFinancialPlan(req: Request, res: Response) {
  const rec = await aiService.generateFinancialPlan(req.user!.id, req.body);
  res.json({ success: true, data: rec });
}

export async function generateWeeklyReview(req: Request, res: Response) {
  const rec = await aiService.generateWeeklyReview(req.user!.id);
  res.json({ success: true, data: rec });
}

export async function chatHandler(req: Request, res: Response) {
  const result = await aiService.chat(req.user!.id, req.body.message);
  res.json({ success: true, data: result });
}
