import { prisma } from '../../config/database.js';
import { NotFoundError, LimitReachedError } from '../../utils/errors.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import { FREE_TIER_LIMITS } from '@eiko/shared-types';
import { calculateStreak, calculateConsistency, toDateString, isHabitDueOnDate, getDayBit } from '@eiko/shared-logic';
import type { Prisma } from '@prisma/client';
import type {
  CreateHabitInput,
  UpdateHabitInput,
  CheckInInput,
  BatchCheckInInput,
  HabitsQueryInput,
} from './habits.schema.js';

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

function serializeHabit(habit: Record<string, unknown>) {
  return {
    ...habit,
    createdAt: (habit.createdAt as Date).toISOString(),
    updatedAt: (habit.updatedAt as Date).toISOString(),
  };
}

function serializeLog(log: Record<string, unknown>) {
  return {
    ...log,
    completedAt: (log.completedAt as Date).toISOString(),
    date: toDateString(log.date as Date),
    createdAt: (log.createdAt as Date).toISOString(),
  };
}

function getTodayString(): string {
  return toDateString(new Date());
}

/**
 * Recalculate streak and consistency for a habit and update cached fields.
 */
async function recalculateHabitStats(habitId: string, daysOfWeek: number) {
  const today = getTodayString();

  const logs = await prisma.habitLog.findMany({
    where: { habitId, skipped: false },
    orderBy: { date: 'asc' },
    select: { date: true },
  });

  const logDates = logs.map((l) => toDateString(l.date));

  const streakResult = calculateStreak({ logDates, daysOfWeek, today });
  const consistencyResult = calculateConsistency({ logDates, daysOfWeek, today });

  await prisma.habit.update({
    where: { id: habitId },
    data: {
      currentStreak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      consistencyScore: Math.round(consistencyResult.score * 100) / 100,
    },
  });

  return { streakResult, consistencyResult };
}

export async function listHabits(userId: string, filters: HabitsQueryInput) {
  const { skip, take } = parsePagination(filters);

  const where: Prisma.HabitWhereInput = { userId };
  if (filters.active !== undefined) {
    where.isActive = filters.active;
  }
  if (filters.goalId) {
    where.goalId = filters.goalId;
  }

  const [habits, total] = await Promise.all([
    prisma.habit.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip,
      take,
    }),
    prisma.habit.count({ where }),
  ]);

  return {
    habits: habits.map(serializeHabit),
    meta: buildPaginationMeta(total, filters),
  };
}

export async function createHabit(userId: string, data: CreateHabitInput) {
  const tier = await getUserTier(userId);

  if (tier === 'FREE') {
    const activeCount = await prisma.habit.count({
      where: { userId, isActive: true },
    });
    if (activeCount >= FREE_TIER_LIMITS.maxActiveHabits) {
      throw new LimitReachedError('habits', FREE_TIER_LIMITS.maxActiveHabits);
    }
  }

  const habit = await prisma.habit.create({
    data: {
      userId,
      title: data.title,
      description: data.description ?? null,
      goalId: data.goalId ?? null,
      frequency: data.frequency ?? 'DAILY',
      daysOfWeek: data.daysOfWeek ?? 127,
      targetPerPeriod: data.targetPerPeriod ?? 1,
      reminderTime: data.reminderTime ?? null,
      color: data.color ?? '#4F46E5',
      icon: data.icon ?? 'check-circle',
    },
  });

  return serializeHabit(habit);
}

export async function getHabit(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    throw new NotFoundError('Habit');
  }

  return serializeHabit(habit);
}

export async function updateHabit(userId: string, habitId: string, data: UpdateHabitInput) {
  const existing = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Habit');
  }

  const habit = await prisma.habit.update({
    where: { id: habitId },
    data,
  });

  return serializeHabit(habit);
}

export async function deleteHabit(userId: string, habitId: string) {
  const existing = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Habit');
  }

  await prisma.habit.delete({
    where: { id: habitId },
  });
}

export async function checkIn(userId: string, habitId: string, input: CheckInInput) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    throw new NotFoundError('Habit');
  }

  const dateStr = input.date ?? getTodayString();
  const dateObj = new Date(dateStr + 'T00:00:00Z');

  // Upsert the log entry for this date (unique on habitId + date)
  const log = await prisma.habitLog.upsert({
    where: {
      habitId_date: { habitId, date: dateObj },
    },
    create: {
      habitId,
      date: dateObj,
      value: input.value ?? 1,
      note: input.note ?? null,
    },
    update: {
      value: input.value ?? 1,
      note: input.note ?? null,
      completedAt: new Date(),
    },
  });

  // Recalculate streak and consistency
  await recalculateHabitStats(habitId, habit.daysOfWeek);

  // Fetch updated habit
  const updatedHabit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  return {
    log: serializeLog(log),
    habit: serializeHabit(updatedHabit!),
  };
}

export async function undoCheckIn(userId: string, habitId: string, dateStr: string) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    throw new NotFoundError('Habit');
  }

  const dateObj = new Date(dateStr + 'T00:00:00Z');

  const log = await prisma.habitLog.findUnique({
    where: {
      habitId_date: { habitId, date: dateObj },
    },
  });

  if (!log) {
    throw new NotFoundError('HabitLog');
  }

  await prisma.habitLog.delete({
    where: { id: log.id },
  });

  // Recalculate streak and consistency
  await recalculateHabitStats(habitId, habit.daysOfWeek);
}

export async function getHistory(
  userId: string,
  habitId: string,
  page?: number,
  perPage?: number,
) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    throw new NotFoundError('Habit');
  }

  const { skip, take } = parsePagination({ page, perPage });

  const [logs, total] = await Promise.all([
    prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
      skip,
      take,
    }),
    prisma.habitLog.count({ where: { habitId } }),
  ]);

  return {
    logs: logs.map(serializeLog),
    meta: buildPaginationMeta(total, { page, perPage }),
  };
}

export async function getStats(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    throw new NotFoundError('Habit');
  }

  const today = getTodayString();

  const allLogs = await prisma.habitLog.findMany({
    where: { habitId, skipped: false },
    orderBy: { date: 'asc' },
    select: { date: true, value: true },
  });

  const logDates = allLogs.map((l) => toDateString(l.date));
  const streakResult = calculateStreak({ logDates, daysOfWeek: habit.daysOfWeek, today });
  const consistencyResult = calculateConsistency({ logDates, daysOfWeek: habit.daysOfWeek, today });

  // Last 7 days count
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
  const sevenDaysAgoStr = toDateString(sevenDaysAgo);

  // Last 30 days count
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 29);
  const thirtyDaysAgoStr = toDateString(thirtyDaysAgo);

  const last7 = logDates.filter((d) => d >= sevenDaysAgoStr).length;
  const last30 = logDates.filter((d) => d >= thirtyDaysAgoStr).length;

  // Calendar heatmap: last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setUTCDate(ninetyDaysAgo.getUTCDate() - 89);
  const ninetyDaysAgoStr = toDateString(ninetyDaysAgo);

  const calendarHeatmap: Record<string, number> = {};
  for (const log of allLogs) {
    const dateStr = toDateString(log.date);
    if (dateStr >= ninetyDaysAgoStr) {
      calendarHeatmap[dateStr] = log.value;
    }
  }

  return {
    currentStreak: streakResult.currentStreak,
    longestStreak: streakResult.longestStreak,
    totalCompletions: allLogs.length,
    consistencyScore: Math.round(consistencyResult.score * 100) / 100,
    last7Days: last7,
    last30Days: last30,
    calendarHeatmap,
  };
}

export async function getTodaysHabits(userId: string) {
  const today = new Date();
  const todayBit = getDayBit(today);
  const todayStr = toDateString(today);
  const todayDate = new Date(todayStr + 'T00:00:00Z');

  // Get all active habits for the user
  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  // Filter habits that are due today using the bitmask
  const dueHabits = habits.filter((h) => (h.daysOfWeek & todayBit) !== 0);

  // Fetch today's logs for the due habits
  const habitIds = dueHabits.map((h) => h.id);
  const todayLogs = await prisma.habitLog.findMany({
    where: {
      habitId: { in: habitIds },
      date: todayDate,
    },
  });

  const logMap = new Map(todayLogs.map((l) => [l.habitId, l]));

  return dueHabits.map((habit) => {
    const log = logMap.get(habit.id);
    return {
      ...serializeHabit(habit),
      completedToday: !!log,
      todayLog: log ? serializeLog(log) : null,
    };
  });
}

export async function batchCheckIn(userId: string, input: BatchCheckInInput) {
  const dateStr = input.date ?? getTodayString();
  const dateObj = new Date(dateStr + 'T00:00:00Z');

  // Verify all habits belong to the user
  const habits = await prisma.habit.findMany({
    where: { id: { in: input.habitIds }, userId },
  });

  if (habits.length !== input.habitIds.length) {
    throw new NotFoundError('One or more habits');
  }

  // Create log entries for each habit
  const results = await Promise.all(
    habits.map(async (habit) => {
      const log = await prisma.habitLog.upsert({
        where: {
          habitId_date: { habitId: habit.id, date: dateObj },
        },
        create: {
          habitId: habit.id,
          date: dateObj,
          value: 1,
        },
        update: {
          completedAt: new Date(),
        },
      });

      await recalculateHabitStats(habit.id, habit.daysOfWeek);

      return {
        habitId: habit.id,
        log: serializeLog(log),
      };
    }),
  );

  return results;
}
