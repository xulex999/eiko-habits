import { prisma } from '../../config/database.js';
import { NotFoundError, LimitReachedError } from '../../utils/errors.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import { FREE_TIER_LIMITS } from '@eiko/shared-types';
import type { Prisma } from '@prisma/client';
import type { CreateGoalInput, UpdateGoalInput, GoalsQueryInput } from './goals.schema.js';

async function getUserTier(userId: string): Promise<'FREE' | 'PREMIUM'> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { tier: true, status: true },
  });
  if (sub && sub.tier === 'PREMIUM' && sub.status === 'ACTIVE') {
    return 'PREMIUM';
  }
  return 'FREE';
}

function serializeGoal(goal: Record<string, unknown>) {
  return {
    ...goal,
    createdAt: (goal.createdAt as Date).toISOString(),
    updatedAt: (goal.updatedAt as Date).toISOString(),
    completedAt: goal.completedAt ? (goal.completedAt as Date).toISOString() : null,
    targetDate: goal.targetDate ? (goal.targetDate as Date).toISOString() : null,
  };
}

export async function listGoals(userId: string, filters: GoalsQueryInput) {
  const { skip, take } = parsePagination(filters);

  const where: Prisma.GoalWhereInput = { userId };
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.category) {
    where.category = filters.category;
  }

  const [goals, total] = await Promise.all([
    prisma.goal.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip,
      take,
    }),
    prisma.goal.count({ where }),
  ]);

  return {
    goals: goals.map(serializeGoal),
    meta: buildPaginationMeta(total, filters),
  };
}

export async function createGoal(userId: string, data: CreateGoalInput) {
  const tier = await getUserTier(userId);

  if (tier === 'FREE') {
    const activeCount = await prisma.goal.count({
      where: { userId, status: 'ACTIVE' },
    });
    if (activeCount >= FREE_TIER_LIMITS.maxActiveGoals) {
      throw new LimitReachedError('goals', FREE_TIER_LIMITS.maxActiveGoals);
    }
  }

  const goal = await prisma.goal.create({
    data: {
      userId,
      title: data.title,
      description: data.description ?? null,
      category: data.category ?? 'CUSTOM',
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      targetValue: data.targetValue ?? null,
      unit: data.unit ?? null,
    },
  });

  return serializeGoal(goal);
}

export async function getGoal(userId: string, goalId: string) {
  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    include: {
      habits: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!goal) {
    throw new NotFoundError('Goal');
  }

  const { habits, ...goalData } = goal;

  return {
    ...serializeGoal(goalData),
    habits: habits.map((h) => ({
      ...h,
      createdAt: h.createdAt.toISOString(),
      updatedAt: h.updatedAt.toISOString(),
    })),
  };
}

export async function updateGoal(userId: string, goalId: string, data: UpdateGoalInput) {
  const existing = await prisma.goal.findFirst({
    where: { id: goalId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Goal');
  }

  const updateData: Prisma.GoalUpdateInput = { ...data };

  if (data.targetDate !== undefined) {
    updateData.targetDate = data.targetDate ? new Date(data.targetDate) : null;
  }

  const goal = await prisma.goal.update({
    where: { id: goalId },
    data: updateData,
  });

  return serializeGoal(goal);
}

export async function deleteGoal(userId: string, goalId: string) {
  const existing = await prisma.goal.findFirst({
    where: { id: goalId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Goal');
  }

  await prisma.goal.delete({
    where: { id: goalId },
  });
}

export async function updateProgress(userId: string, goalId: string, currentValue: number) {
  const existing = await prisma.goal.findFirst({
    where: { id: goalId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Goal');
  }

  const goal = await prisma.goal.update({
    where: { id: goalId },
    data: { currentValue },
  });

  return serializeGoal(goal);
}

export async function completeGoal(userId: string, goalId: string) {
  const existing = await prisma.goal.findFirst({
    where: { id: goalId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Goal');
  }

  const goal = await prisma.goal.update({
    where: { id: goalId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      currentValue: existing.targetValue ?? existing.currentValue,
    },
  });

  return serializeGoal(goal);
}
