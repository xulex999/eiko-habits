import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { goalsRoutes } from './modules/goals/goals.routes.js';
import { habitsRoutes } from './modules/habits/habits.routes.js';
import { financeRoutes } from './modules/finance/finance.routes.js';
import { aiRoutes } from './modules/ai/ai.routes.js';
import { subscriptionsRoutes } from './modules/subscriptions/subscriptions.routes.js';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes.js';
import { notificationsRoutes } from './modules/notifications/notifications.routes.js';
import { journalRoutes } from './modules/journal/journal.routes.js';
import { todosRoutes } from './modules/todos/todos.routes.js';

export function createApp() {
  const app = express();

  // Security
  app.use(helmet());
  app.use(
    cors({
      origin: [env.WEB_URL, 'http://localhost:3000', 'http://localhost:8081'],
      credentials: true,
    }),
  );

  // Body parsing
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/goals', goalsRoutes);
  app.use('/api/v1/habits', habitsRoutes);
  app.use('/api/v1/finance', financeRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/subscriptions', subscriptionsRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/notifications', notificationsRoutes);
  app.use('/api/v1/journal', journalRoutes);
  app.use('/api/v1/todos', todosRoutes);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
