import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../utils/errors.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import { calculateForecast } from '@eiko/shared-logic';
import type { CreateFinancialGoalInput, UpdateFinancialGoalInput, CreateContributionInput, FinancialGoalQuery } from './finance.schema.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function decimalToNumber(val: Decimal | null | undefined): number | null {
  if (val == null) return null;
  return Number(val);
}

function serializeGoal(goal: any) {
  return {
    ...goal,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount),
    minimumPayment: decimalToNumber(goal.minimumPayment),
    monthlyBudget: decimalToNumber(goal.monthlyBudget),
    startDate: goal.startDate instanceof Date ? goal.startDate.toISOString() : goal.startDate,
    targetDate: goal.targetDate instanceof Date ? goal.targetDate.toISOString() : goal.targetDate,
    createdAt: goal.createdAt instanceof Date ? goal.createdAt.toISOString() : goal.createdAt,
    updatedAt: goal.updatedAt instanceof Date ? goal.updatedAt.toISOString() : goal.updatedAt,
    completedAt: goal.completedAt instanceof Date ? goal.completedAt.toISOString() : goal.completedAt,
    projectedCompletionDate: goal.projectedCompletionDate instanceof Date ? goal.projectedCompletionDate.toISOString() : goal.projectedCompletionDate,
  };
}

function serializeContribution(c: any) {
  return {
    ...c,
    amount: Number(c.amount),
    date: c.date instanceof Date ? c.date.toISOString().split('T')[0] : c.date,
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
  };
}

function todayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// ---------------------------------------------------------------------------
// Ownership check
// ---------------------------------------------------------------------------

async function getOwnedGoal(userId: string, goalId: string) {
  const goal = await prisma.financialGoal.findUnique({ where: { id: goalId } });
  if (!goal || goal.userId !== userId) {
    throw new NotFoundError('Financial goal');
  }
  return goal;
}

// ---------------------------------------------------------------------------
// CRUD – Financial Goals
// ---------------------------------------------------------------------------

export async function listFinancialGoals(userId: string, query: FinancialGoalQuery) {
  const { skip, take } = parsePagination({ page: query.page, perPage: query.perPage });

  const where: any = { userId };
  if (query.type) where.type = query.type;
  if (query.active !== undefined) where.isActive = query.active;

  const [goals, total] = await Promise.all([
    prisma.financialGoal.findMany({ where, skip, take, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
    prisma.financialGoal.count({ where }),
  ]);

  return {
    data: goals.map(serializeGoal),
    meta: buildPaginationMeta(total, { page: query.page, perPage: query.perPage }),
  };
}

export async function createFinancialGoal(userId: string, input: CreateFinancialGoalInput) {
  const goal = await prisma.financialGoal.create({
    data: {
      userId,
      type: input.type,
      title: input.title,
      description: input.description,
      targetAmount: input.targetAmount,
      currentAmount: input.currentAmount ?? 0,
      currency: input.currency ?? 'USD',
      targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
      interestRate: input.interestRate,
      minimumPayment: input.minimumPayment,
      monthlyBudget: input.monthlyBudget,
      budgetCategory: input.budgetCategory,
      color: input.color ?? '#10B981',
      icon: input.icon ?? 'dollar-sign',
    },
  });

  return serializeGoal(goal);
}

export async function getFinancialGoal(userId: string, goalId: string) {
  const goal = await getOwnedGoal(userId, goalId);
  return serializeGoal(goal);
}

export async function updateFinancialGoal(userId: string, goalId: string, input: UpdateFinancialGoalInput) {
  await getOwnedGoal(userId, goalId);

  const data: any = { ...input };
  if (input.targetDate !== undefined) {
    data.targetDate = input.targetDate ? new Date(input.targetDate) : null;
  }

  const updated = await prisma.financialGoal.update({ where: { id: goalId }, data });
  return serializeGoal(updated);
}

export async function deleteFinancialGoal(userId: string, goalId: string) {
  await getOwnedGoal(userId, goalId);
  await prisma.financialGoal.delete({ where: { id: goalId } });
}

// ---------------------------------------------------------------------------
// Contributions
// ---------------------------------------------------------------------------

export async function addContribution(userId: string, goalId: string, input: CreateContributionInput) {
  const goal = await getOwnedGoal(userId, goalId);

  const dateStr = input.date ?? todayDateString();

  const contribution = await prisma.contribution.create({
    data: {
      financialGoalId: goalId,
      type: input.type,
      amount: input.amount,
      date: new Date(dateStr + 'T00:00:00Z'),
      note: input.note,
    },
  });

  // Recalculate currentAmount based on contribution type
  let delta: number;
  switch (input.type) {
    case 'DEPOSIT':
    case 'PAYMENT':
      delta = input.amount;
      break;
    case 'WITHDRAWAL':
      delta = -input.amount;
      break;
    case 'ADJUSTMENT':
      delta = input.amount;
      break;
    default:
      delta = input.amount;
  }

  const newCurrentAmount = Number(goal.currentAmount) + delta;

  // Recalculate forecast cache
  const contributions = await prisma.contribution.findMany({
    where: { financialGoalId: goalId },
    orderBy: { date: 'asc' },
  });

  const forecast = calculateForecast({
    currentAmount: newCurrentAmount,
    targetAmount: Number(goal.targetAmount),
    startDate: goal.startDate.toISOString().split('T')[0],
    targetDate: goal.targetDate ? goal.targetDate.toISOString().split('T')[0] : undefined,
    today: todayDateString(),
    contributions: contributions.map((c) => ({
      date: c.date.toISOString().split('T')[0],
      amount: Number(c.amount),
    })),
    interestRate: goal.interestRate ?? undefined,
  });

  await prisma.financialGoal.update({
    where: { id: goalId },
    data: {
      currentAmount: newCurrentAmount,
      projectedCompletionDate: forecast.projectedCompletionDate ? new Date(forecast.projectedCompletionDate) : null,
      paceStatus: forecast.paceStatus,
    },
  });

  return serializeContribution(contribution);
}

export async function listContributions(userId: string, goalId: string, query: { page?: number; perPage?: number }) {
  await getOwnedGoal(userId, goalId);

  const { skip, take } = parsePagination({ page: query.page, perPage: query.perPage });

  const [contributions, total] = await Promise.all([
    prisma.contribution.findMany({
      where: { financialGoalId: goalId },
      skip,
      take,
      orderBy: { date: 'desc' },
    }),
    prisma.contribution.count({ where: { financialGoalId: goalId } }),
  ]);

  return {
    data: contributions.map(serializeContribution),
    meta: buildPaginationMeta(total, { page: query.page, perPage: query.perPage }),
  };
}

export async function deleteContribution(userId: string, goalId: string, contributionId: string) {
  const goal = await getOwnedGoal(userId, goalId);

  const contribution = await prisma.contribution.findUnique({ where: { id: contributionId } });
  if (!contribution || contribution.financialGoalId !== goalId) {
    throw new NotFoundError('Contribution');
  }

  // Reverse the contribution effect on currentAmount
  let delta: number;
  switch (contribution.type) {
    case 'DEPOSIT':
    case 'PAYMENT':
      delta = -Number(contribution.amount);
      break;
    case 'WITHDRAWAL':
      delta = Number(contribution.amount);
      break;
    case 'ADJUSTMENT':
      delta = -Number(contribution.amount);
      break;
    default:
      delta = -Number(contribution.amount);
  }

  await prisma.contribution.delete({ where: { id: contributionId } });

  const newCurrentAmount = Number(goal.currentAmount) + delta;

  // Recalculate forecast
  const remainingContributions = await prisma.contribution.findMany({
    where: { financialGoalId: goalId },
    orderBy: { date: 'asc' },
  });

  const forecast = calculateForecast({
    currentAmount: newCurrentAmount,
    targetAmount: Number(goal.targetAmount),
    startDate: goal.startDate.toISOString().split('T')[0],
    targetDate: goal.targetDate ? goal.targetDate.toISOString().split('T')[0] : undefined,
    today: todayDateString(),
    contributions: remainingContributions.map((c) => ({
      date: c.date.toISOString().split('T')[0],
      amount: Number(c.amount),
    })),
    interestRate: goal.interestRate ?? undefined,
  });

  await prisma.financialGoal.update({
    where: { id: goalId },
    data: {
      currentAmount: newCurrentAmount,
      projectedCompletionDate: forecast.projectedCompletionDate ? new Date(forecast.projectedCompletionDate) : null,
      paceStatus: forecast.paceStatus,
    },
  });
}

// ---------------------------------------------------------------------------
// Forecast
// ---------------------------------------------------------------------------

export async function getForecast(userId: string, goalId: string) {
  const goal = await getOwnedGoal(userId, goalId);

  const contributions = await prisma.contribution.findMany({
    where: { financialGoalId: goalId },
    orderBy: { date: 'asc' },
  });

  return calculateForecast({
    currentAmount: Number(goal.currentAmount),
    targetAmount: Number(goal.targetAmount),
    startDate: goal.startDate.toISOString().split('T')[0],
    targetDate: goal.targetDate ? goal.targetDate.toISOString().split('T')[0] : undefined,
    today: todayDateString(),
    contributions: contributions.map((c) => ({
      date: c.date.toISOString().split('T')[0],
      amount: Number(c.amount),
    })),
    interestRate: goal.interestRate ?? undefined,
  });
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

export async function getFinancialSummary(userId: string) {
  const goals = await prisma.financialGoal.findMany({
    where: { userId, isActive: true },
  });

  let totalSavingsProgress = 0;
  let totalSavingsTarget = 0;
  let totalDebtRemaining = 0;
  let totalDebtOriginal = 0;
  let totalBudgetUsed = 0;
  let totalBudgetAllocated = 0;
  let goalsOnTrack = 0;
  let goalsBehind = 0;

  for (const goal of goals) {
    const current = Number(goal.currentAmount);
    const target = Number(goal.targetAmount);

    switch (goal.type) {
      case 'SAVINGS':
      case 'INVESTMENT':
        totalSavingsProgress += current;
        totalSavingsTarget += target;
        break;
      case 'DEBT_PAYOFF':
        totalDebtRemaining += Math.max(0, target - current);
        totalDebtOriginal += target;
        break;
      case 'BUDGET':
        totalBudgetUsed += current;
        totalBudgetAllocated += target;
        break;
    }

    if (goal.paceStatus === 'ahead' || goal.paceStatus === 'on_track') {
      goalsOnTrack++;
    } else if (goal.paceStatus === 'behind') {
      goalsBehind++;
    }
  }

  const monthlyBudgetUtilization =
    totalBudgetAllocated > 0 ? totalBudgetUsed / totalBudgetAllocated : 0;

  return {
    totalSavingsProgress,
    totalSavingsTarget,
    totalDebtRemaining,
    totalDebtOriginal,
    monthlyBudgetUtilization: Math.round(monthlyBudgetUtilization * 100) / 100,
    activeGoals: goals.length,
    goalsOnTrack,
    goalsBehind,
  };
}
