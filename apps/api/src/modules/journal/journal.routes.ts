import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import { createJournalEntrySchema, updateJournalEntrySchema, journalQuerySchema } from './journal.schema.js';
import * as journalController from './journal.controller.js';

export const journalRoutes = Router();

journalRoutes.use(requireAuth);

journalRoutes.get('/', validateQuery(journalQuerySchema), journalController.listEntries);
journalRoutes.post('/', validate(createJournalEntrySchema), journalController.createEntry);
journalRoutes.get('/today', journalController.getTodaysEntry);
journalRoutes.get('/:id', journalController.getEntry);
journalRoutes.patch('/:id', validate(updateJournalEntrySchema), journalController.updateEntry);
journalRoutes.delete('/:id', journalController.deleteEntry);
