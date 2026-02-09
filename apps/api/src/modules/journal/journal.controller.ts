import type { Request, Response } from 'express';
import * as journalService from './journal.service.js';

export async function listEntries(req: Request, res: Response) {
  const result = await journalService.listEntries(req.user!.id, req.query as any);
  res.json({ success: true, data: result.entries, meta: result.meta });
}

export async function createEntry(req: Request, res: Response) {
  const data = await journalService.createEntry(req.user!.id, req.body);
  res.status(201).json({ success: true, data });
}

export async function getEntry(req: Request, res: Response) {
  const data = await journalService.getEntry(req.user!.id, req.params.id);
  res.json({ success: true, data });
}

export async function getTodaysEntry(req: Request, res: Response) {
  const today = new Date().toISOString().split('T')[0];
  const data = await journalService.getEntryByDate(req.user!.id, today);
  res.json({ success: true, data });
}

export async function updateEntry(req: Request, res: Response) {
  const data = await journalService.updateEntry(req.user!.id, req.params.id, req.body);
  res.json({ success: true, data });
}

export async function deleteEntry(req: Request, res: Response) {
  await journalService.deleteEntry(req.user!.id, req.params.id);
  res.json({ success: true });
}
