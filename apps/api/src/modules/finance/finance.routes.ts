import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import {
  createFinancialGoalSchema,
  updateFinancialGoalSchema,
  createContributionSchema,
  financialGoalQuerySchema,
  contributionQuerySchema,
} from './finance.schema.js';
import * as financeController from './finance.controller.js';

export const financeRoutes = Router();

// All routes require auth
financeRoutes.use(requireAuth);

// Financial Goals
financeRoutes.get('/goals', validateQuery(financialGoalQuerySchema), financeController.listFinancialGoals);
financeRoutes.post('/goals', validate(createFinancialGoalSchema), financeController.createFinancialGoal);
financeRoutes.get('/goals/:id', financeController.getFinancialGoal);
financeRoutes.patch('/goals/:id', validate(updateFinancialGoalSchema), financeController.updateFinancialGoal);
financeRoutes.delete('/goals/:id', financeController.deleteFinancialGoal);

// Contributions
financeRoutes.post('/goals/:id/contributions', validate(createContributionSchema), financeController.addContribution);
financeRoutes.get('/goals/:id/contributions', validateQuery(contributionQuerySchema), financeController.listContributions);
financeRoutes.delete('/goals/:id/contributions/:cid', financeController.deleteContribution);

// Forecast
financeRoutes.get('/goals/:id/forecast', financeController.getForecast);

// Summary
financeRoutes.get('/summary', financeController.getFinancialSummary);
