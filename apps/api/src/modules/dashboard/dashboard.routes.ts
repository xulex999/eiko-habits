import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import * as dashboardController from './dashboard.controller.js';

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth);

dashboardRoutes.get('/overview', dashboardController.getOverview);
// /today, /streaks, /weekly-summary are subsets of /overview
// For now they share the same handler; can be split for optimization
dashboardRoutes.get('/today', dashboardController.getOverview);
dashboardRoutes.get('/streaks', dashboardController.getOverview);
dashboardRoutes.get('/weekly-summary', dashboardController.getOverview);
