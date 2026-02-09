import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import {
  createHabitSchema,
  updateHabitSchema,
  checkInSchema,
  batchCheckInSchema,
  habitsQuerySchema,
} from './habits.schema.js';
import * as habitsController from './habits.controller.js';

export const habitsRoutes = Router();

habitsRoutes.use(requireAuth);

// List and create
habitsRoutes.get('/', validateQuery(habitsQuerySchema), habitsController.listHabits);
habitsRoutes.post('/', validate(createHabitSchema), habitsController.createHabit);

// Today's habits and batch operations (must come before /:id routes)
habitsRoutes.get('/today', habitsController.getTodaysHabits);
habitsRoutes.post('/batch-check-in', validate(batchCheckInSchema), habitsController.batchCheckIn);

// Individual habit CRUD
habitsRoutes.get('/:id', habitsController.getHabit);
habitsRoutes.patch('/:id', validate(updateHabitSchema), habitsController.updateHabit);
habitsRoutes.delete('/:id', habitsController.deleteHabit);

// Check-in operations
habitsRoutes.post('/:id/check-in', validate(checkInSchema), habitsController.checkIn);
habitsRoutes.delete('/:id/check-in/:date', habitsController.undoCheckIn);

// History and stats
habitsRoutes.get('/:id/history', habitsController.getHistory);
habitsRoutes.get('/:id/stats', habitsController.getStats);
