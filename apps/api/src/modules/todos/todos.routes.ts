import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import { createTodoSchema, updateTodoSchema, todosQuerySchema } from './todos.schema.js';
import * as todosController from './todos.controller.js';

export const todosRoutes = Router();

todosRoutes.use(requireAuth);

todosRoutes.get('/', validateQuery(todosQuerySchema), todosController.listTodos);
todosRoutes.post('/', validate(createTodoSchema), todosController.createTodo);
todosRoutes.get('/today', todosController.getTodaysTodos);
todosRoutes.patch('/:id', validate(updateTodoSchema), todosController.updateTodo);
todosRoutes.delete('/:id', todosController.deleteTodo);
