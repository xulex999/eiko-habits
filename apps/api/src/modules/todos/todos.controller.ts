import type { Request, Response } from 'express';
import * as todosService from './todos.service.js';

export async function listTodos(req: Request, res: Response) {
  const result = await todosService.listTodos(req.user!.id, req.query as any);
  res.json({ success: true, data: result.todos, meta: result.meta });
}

export async function createTodo(req: Request, res: Response) {
  const data = await todosService.createTodo(req.user!.id, req.body);
  res.status(201).json({ success: true, data });
}

export async function getTodaysTodos(req: Request, res: Response) {
  const data = await todosService.getTodaysTodos(req.user!.id);
  res.json({ success: true, data });
}

export async function updateTodo(req: Request, res: Response) {
  const data = await todosService.updateTodo(req.user!.id, req.params.id, req.body);
  res.json({ success: true, data });
}

export async function deleteTodo(req: Request, res: Response) {
  await todosService.deleteTodo(req.user!.id, req.params.id);
  res.json({ success: true });
}
