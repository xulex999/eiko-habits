import type { Request, Response } from 'express';
import * as notificationsService from './notifications.service.js';

export async function listNotifications(req: Request, res: Response) {
  const result = await notificationsService.listNotifications(req.user!.id, req.query as any);
  res.json({ success: true, data: result.notifications, meta: result.meta });
}

export async function getUnreadCount(req: Request, res: Response) {
  const data = await notificationsService.getUnreadCount(req.user!.id);
  res.json({ success: true, data });
}

export async function markAsRead(req: Request, res: Response) {
  const data = await notificationsService.markAsRead(req.user!.id, req.params.id);
  res.json({ success: true, data });
}

export async function markAllAsRead(req: Request, res: Response) {
  await notificationsService.markAllAsRead(req.user!.id);
  res.json({ success: true });
}
