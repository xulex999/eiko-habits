import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validateQuery } from '../../middleware/validate.js';
import { notificationsQuerySchema } from './notifications.schema.js';
import * as notificationsController from './notifications.controller.js';

export const notificationsRoutes = Router();

notificationsRoutes.use(requireAuth);

notificationsRoutes.get('/', validateQuery(notificationsQuerySchema), notificationsController.listNotifications);
notificationsRoutes.get('/unread-count', notificationsController.getUnreadCount);
notificationsRoutes.post('/:id/read', notificationsController.markAsRead);
notificationsRoutes.post('/read-all', notificationsController.markAllAsRead);
