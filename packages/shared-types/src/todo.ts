export type TodoItemStatus = 'PENDING' | 'COMPLETED' | 'SKIPPED';
export type TodoItemSource = 'USER' | 'AI_GENERATED';

export interface TodoItem {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  source: TodoItemSource;
  status: TodoItemStatus;
  dueDate: string | null;
  sortOrder: number;
  aiContext: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateTodoItemInput {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTodoItemInput {
  title?: string;
  description?: string;
  status?: TodoItemStatus;
  sortOrder?: number;
  dueDate?: string | null;
}
