import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import {
  createGoalSchema,
  updateGoalSchema,
  updateProgressSchema,
  goalsQuerySchema,
} from './goals.schema.js';
import * as goalsController from './goals.controller.js';

export const goalsRoutes = Router();

goalsRoutes.use(requireAuth);

goalsRoutes.get('/', validateQuery(goalsQuerySchema), goalsController.listGoals);
goalsRoutes.post('/', validate(createGoalSchema), goalsController.createGoal);
goalsRoutes.get('/:id', goalsController.getGoal);
goalsRoutes.patch('/:id', validate(updateGoalSchema), goalsController.updateGoal);
goalsRoutes.delete('/:id', goalsController.deleteGoal);
goalsRoutes.patch('/:id/progress', validate(updateProgressSchema), goalsController.updateProgress);
goalsRoutes.post('/:id/complete', goalsController.completeGoal);
