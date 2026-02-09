import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { requirePremium } from '../../middleware/premium.js';
import { validate } from '../../middleware/validate.js';
import { chatSchema, generateRoutineSchema, generateFinancialPlanSchema } from './ai.schema.js';
import * as aiController from './ai.controller.js';

export const aiRoutes = Router();

// All AI routes require auth + premium
aiRoutes.use(requireAuth, requirePremium);

aiRoutes.get('/recommendations', aiController.getRecommendations);
aiRoutes.post('/recommendations/:id/dismiss', aiController.dismissRecommendation);
aiRoutes.post('/habit-routine', validate(generateRoutineSchema), aiController.generateHabitRoutine);
aiRoutes.post('/financial-plan', validate(generateFinancialPlanSchema), aiController.generateFinancialPlan);
aiRoutes.post('/weekly-review', aiController.generateWeeklyReview);
aiRoutes.post('/chat', validate(chatSchema), aiController.chatHandler);
aiRoutes.post('/daily-todos', aiController.generateDailyTodos);
aiRoutes.post('/smart-reminders', aiController.generateSmartReminders);
