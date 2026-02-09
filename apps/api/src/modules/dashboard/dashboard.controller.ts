import type { Request, Response } from 'express';
import * as dashboardService from './dashboard.service.js';

export async function getOverview(req: Request, res: Response) {
  const overview = await dashboardService.getDashboardOverview(req.user!.id);
  res.json({ success: true, data: overview });
}
