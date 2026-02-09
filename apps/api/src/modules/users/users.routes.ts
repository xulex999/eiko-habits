import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  updateProfileSchema,
  onboardingSchema,
  updateNotificationsSchema,
  registerDeviceSchema,
} from './users.schema.js';
import * as usersController from './users.controller.js';

export const usersRoutes = Router();

usersRoutes.use(requireAuth);

// Profile
usersRoutes.get('/me', usersController.getProfile);
usersRoutes.patch('/me', validate(updateProfileSchema), usersController.updateProfile);
usersRoutes.delete('/me', usersController.deleteAccount);

// Onboarding
usersRoutes.post('/me/onboarding', validate(onboardingSchema), usersController.submitOnboarding);
usersRoutes.get('/me/onboarding', usersController.getOnboarding);

// Notifications
usersRoutes.put('/me/notifications', validate(updateNotificationsSchema), usersController.updateNotifications);
usersRoutes.get('/me/notifications', usersController.getNotifications);

// Devices
usersRoutes.post('/me/devices', validate(registerDeviceSchema), usersController.registerDevice);
usersRoutes.delete('/me/devices/:id', usersController.removeDevice);
