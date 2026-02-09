import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../utils/errors.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import type { Prisma } from '@prisma/client';
import type { NotificationsQueryInput } from './notifications.schema.js';

function serializeNotification(notification: Record<string, unknown>) {
  return {
    ...notification,
    createdAt: (notification.createdAt as Date).toISOString(),
  };
}

export async function listNotifications(userId: string, filters: NotificationsQueryInput) {
  const { skip, take } = parsePagination(filters);

  const where: Prisma.NotificationWhereInput = { userId };
  if (filters.unreadOnly) {
    where.isRead = false;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    notifications: notifications.map(serializeNotification),
    meta: buildPaginationMeta(total, filters),
  };
}

export async function getUnreadCount(userId: string) {
  const count = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  return { count };
}

export async function markAsRead(userId: string, notificationId: string) {
  const existing = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Notification');
  }

  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return serializeNotification(notification);
}

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function createNotification(data: {
  userId: string;
  type: 'STREAK_MILESTONE' | 'GOAL_DEADLINE' | 'HABIT_REMINDER' | 'FINANCIAL_ALERT' | 'AI_INSIGHT' | 'SYSTEM';
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  actionUrl?: string;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      metadata: data.metadata ?? undefined,
      actionUrl: data.actionUrl ?? null,
    },
  });

  return serializeNotification(notification);
}
