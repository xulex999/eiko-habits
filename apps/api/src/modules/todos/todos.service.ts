import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../utils/errors.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import type { Prisma } from '@prisma/client';
import type { CreateTodoInput, UpdateTodoInput, TodosQueryInput } from './todos.schema.js';

function serializeTodo(todo: Record<string, unknown>) {
  return {
    ...todo,
    createdAt: (todo.createdAt as Date).toISOString(),
    updatedAt: (todo.updatedAt as Date).toISOString(),
    completedAt: todo.completedAt ? (todo.completedAt as Date).toISOString() : null,
    dueDate: todo.dueDate ? (todo.dueDate as Date).toISOString().split('T')[0] : null,
  };
}

export async function listTodos(userId: string, filters: TodosQueryInput) {
  const { skip, take } = parsePagination(filters);

  const where: Prisma.TodoItemWhereInput = { userId };
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.source) {
    where.source = filters.source;
  }

  const [todos, total] = await Promise.all([
    prisma.todoItem.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip,
      take,
    }),
    prisma.todoItem.count({ where }),
  ]);

  return {
    todos: todos.map(serializeTodo),
    meta: buildPaginationMeta(total, filters),
  };
}

export async function createTodo(userId: string, data: CreateTodoInput) {
  const todo = await prisma.todoItem.create({
    data: {
      userId,
      title: data.title,
      description: data.description ?? null,
      source: 'USER',
      status: 'PENDING',
      dueDate: data.dueDate ? new Date(data.dueDate + 'T00:00:00Z') : null,
    },
  });

  return serializeTodo(todo);
}

export async function getTodaysTodos(userId: string) {
  const today = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00Z');
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  const todos = await prisma.todoItem.findMany({
    where: {
      userId,
      status: 'PENDING',
      OR: [
        { dueDate: { gte: today, lt: tomorrow } },
        { dueDate: null },
      ],
    },
    orderBy: { sortOrder: 'asc' },
  });

  return todos.map(serializeTodo);
}

export async function updateTodo(userId: string, todoId: string, data: UpdateTodoInput) {
  const existing = await prisma.todoItem.findFirst({
    where: { id: todoId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Todo');
  }

  const updateData: Prisma.TodoItemUpdateInput = { ...data };

  // Handle completedAt based on status changes
  if (data.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
    updateData.completedAt = new Date();
  } else if (data.status && data.status !== 'COMPLETED' && existing.status === 'COMPLETED') {
    updateData.completedAt = null;
  }

  // Parse dueDate if provided
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate + 'T00:00:00Z') : null;
  }

  const todo = await prisma.todoItem.update({
    where: { id: todoId },
    data: updateData,
  });

  return serializeTodo(todo);
}

export async function deleteTodo(userId: string, todoId: string) {
  const existing = await prisma.todoItem.findFirst({
    where: { id: todoId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Todo');
  }

  await prisma.todoItem.delete({
    where: { id: todoId },
  });
}
