import type { Request, Response } from 'express';
import * as financeService from './finance.service.js';

export async function listFinancialGoals(req: Request, res: Response) {
  const result = await financeService.listFinancialGoals(req.user!.id, (req as any).validatedQuery || req.query);

  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
}

export async function createFinancialGoal(req: Request, res: Response) {
  const goal = await financeService.createFinancialGoal(req.user!.id, req.body);

  res.status(201).json({
    success: true,
    data: goal,
  });
}

export async function getFinancialGoal(req: Request, res: Response) {
  const goal = await financeService.getFinancialGoal(req.user!.id, req.params.id);

  res.json({
    success: true,
    data: goal,
  });
}

export async function updateFinancialGoal(req: Request, res: Response) {
  const goal = await financeService.updateFinancialGoal(req.user!.id, req.params.id, req.body);

  res.json({
    success: true,
    data: goal,
  });
}

export async function deleteFinancialGoal(req: Request, res: Response) {
  await financeService.deleteFinancialGoal(req.user!.id, req.params.id);

  res.json({ success: true });
}

export async function addContribution(req: Request, res: Response) {
  const contribution = await financeService.addContribution(req.user!.id, req.params.id, req.body);

  res.status(201).json({
    success: true,
    data: contribution,
  });
}

export async function listContributions(req: Request, res: Response) {
  const result = await financeService.listContributions(req.user!.id, req.params.id, (req as any).validatedQuery || req.query);

  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
}

export async function deleteContribution(req: Request, res: Response) {
  await financeService.deleteContribution(req.user!.id, req.params.id, req.params.cid);

  res.json({ success: true });
}

export async function getForecast(req: Request, res: Response) {
  const forecast = await financeService.getForecast(req.user!.id, req.params.id);

  res.json({
    success: true,
    data: forecast,
  });
}

export async function getFinancialSummary(req: Request, res: Response) {
  const summary = await financeService.getFinancialSummary(req.user!.id);

  res.json({
    success: true,
    data: summary,
  });
}
