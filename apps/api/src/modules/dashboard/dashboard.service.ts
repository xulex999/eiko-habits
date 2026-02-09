import { prisma } from '../../config/database.js';
import { isHabitDueOnDate, toDateString, getDateRange, getDayBit } from '@eiko/shared-logic';
import { getGreeting } from '@eiko/shared-logic';

export async function getDashboardOverview(userId: string) {
  const now = new Date();
  const today = toDateString(now);
  const todayDate = new Date(today + 'T00:00:00Z');
  const dayBit = getDayBit(todayDate);

  // Fetch data in parallel
  const [
    user,
    habits,
    habitLogsToday,
    activeGoals,
    financialGoals,
    notifications,
    recentJournalEntries,
    pendingTodos,
    subscription,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { displayName: true } }),
    prisma.habit.findMany({ where: { userId, isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.habitLog.findMany({
      where: { habit: { userId }, date: todayDate },
    }),
    prisma.goal.findMany({ where: { userId, status: 'ACTIVE' } }),
    prisma.financialGoal.findMany({ where: { userId, isActive: true } }),
    prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 3,
    }),
    prisma.todoItem.findMany({
      where: { userId, status: 'PENDING' },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 10,
    }),
    prisma.subscription.findUnique({
      where: { userId },
      select: { tier: true, status: true },
    }),
  ]);

  const todayLogMap = new Map(habitLogsToday.map((l) => [l.habitId, l]));

  // Filter habits due today and attach completion status
  const todaysHabits = habits
    .filter((h) => (h.daysOfWeek & dayBit) !== 0)
    .map((h) => ({
      ...h,
      consistencyScore: h.consistencyScore,
      completedToday: todayLogMap.has(h.id),
      todayLog: todayLogMap.get(h.id) || null,
    }));

  // Find streak highlight (habit with longest current streak)
  const streakHighlight = habits
    .filter((h) => h.currentStreak > 0)
    .sort((a, b) => b.currentStreak - a.currentStreak)[0];

  // Upcoming deadlines (within 14 days)
  const twoWeeksFromNow = new Date(todayDate);
  twoWeeksFromNow.setUTCDate(twoWeeksFromNow.getUTCDate() + 14);

  const goalDeadlines = activeGoals
    .filter((g) => g.targetDate && g.targetDate <= twoWeeksFromNow)
    .map((g) => ({
      id: g.id,
      title: g.title,
      type: 'goal' as const,
      targetDate: g.targetDate!.toISOString().split('T')[0],
      daysRemaining: Math.ceil((g.targetDate!.getTime() - todayDate.getTime()) / 86400000),
      percentComplete: g.targetValue ? (g.currentValue / g.targetValue) * 100 : 0,
    }));

  const financeDeadlines = financialGoals
    .filter((g) => g.targetDate && g.targetDate <= twoWeeksFromNow)
    .map((g) => ({
      id: g.id,
      title: g.title,
      type: 'financial' as const,
      targetDate: g.targetDate!.toISOString().split('T')[0],
      daysRemaining: Math.ceil((g.targetDate!.getTime() - todayDate.getTime()) / 86400000),
      percentComplete: Number(g.targetAmount) > 0
        ? (Number(g.currentAmount) / Number(g.targetAmount)) * 100
        : 0,
    }));

  const upcomingDeadlines = [...goalDeadlines, ...financeDeadlines]
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5);

  // Build reminders from existing data
  const oneWeekFromNow = new Date(todayDate);
  oneWeekFromNow.setUTCDate(oneWeekFromNow.getUTCDate() + 7);

  const reminders: Array<{
    id: string;
    title: string;
    message: string;
    type: 'habit' | 'goal' | 'financial' | 'ai';
    urgency: 'low' | 'medium' | 'high';
    actionUrl?: string;
  }> = [];

  // Habit reminders: due today but not completed
  todaysHabits
    .filter((h) => !h.completedToday)
    .forEach((h) => {
      reminders.push({
        id: `habit-${h.id}`,
        title: h.title,
        message: `Don't forget to complete "${h.title}" today`,
        type: 'habit',
        urgency: 'medium',
        actionUrl: `/habits`,
      });
    });

  // Goal deadline reminders
  activeGoals
    .filter((g) => g.targetDate && g.targetDate <= oneWeekFromNow)
    .forEach((g) => {
      const days = Math.ceil((g.targetDate!.getTime() - todayDate.getTime()) / 86400000);
      reminders.push({
        id: `goal-${g.id}`,
        title: g.title,
        message: days <= 0
          ? `"${g.title}" deadline has passed!`
          : days <= 3
            ? `"${g.title}" is due in ${days} day${days === 1 ? '' : 's'}`
            : `"${g.title}" deadline is approaching (${days} days)`,
        type: 'goal',
        urgency: days <= 0 ? 'high' : days <= 3 ? 'medium' : 'low',
        actionUrl: `/goals`,
      });
    });

  // Financial reminders: off-pace goals
  financialGoals
    .filter((g) => g.paceStatus === 'behind')
    .forEach((g) => {
      reminders.push({
        id: `finance-${g.id}`,
        title: g.title,
        message: `"${g.title}" is behind pace — consider increasing contributions`,
        type: 'financial',
        urgency: 'medium',
        actionUrl: `/finance`,
      });
    });

  // Weekly summary: last 7 days completion rates
  const weekStart = new Date(todayDate);
  weekStart.setUTCDate(weekStart.getUTCDate() - 6);

  const weekLogs = await prisma.habitLog.findMany({
    where: {
      habit: { userId },
      date: { gte: weekStart, lte: todayDate },
      skipped: false,
    },
    select: { date: true },
  });

  const weekRange = getDateRange(weekStart, todayDate);
  const completionRates = weekRange.map((date) => {
    const dateStr = toDateString(date);
    const dueHabits = habits.filter((h) => isHabitDueOnDate(h.daysOfWeek, date));
    if (dueHabits.length === 0) return 0;
    const completed = weekLogs.filter(
      (l) => toDateString(l.date) === dateStr,
    ).length;
    return Math.min(1, completed / dueHabits.length);
  });

  const totalDue = completionRates.length;
  const avgConsistency = totalDue > 0
    ? completionRates.reduce((a, b) => a + b, 0) / totalDue
    : 0;

  const tier = subscription && subscription.tier === 'PREMIUM' && subscription.status === 'ACTIVE'
    ? 'PREMIUM'
    : 'FREE';

  return {
    greeting: getGreeting(now.getHours()),
    displayName: user?.displayName || 'User',
    tier,
    todaysHabits,
    activeGoalsCount: activeGoals.length,
    currentStreakHighlight: streakHighlight
      ? { habitTitle: streakHighlight.title, streakDays: streakHighlight.currentStreak }
      : null,
    upcomingDeadlines,
    notifications: notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
    recentJournalEntries: recentJournalEntries.map((j) => ({
      ...j,
      date: j.date.toISOString().split('T')[0],
      createdAt: j.createdAt.toISOString(),
      updatedAt: j.updatedAt.toISOString(),
    })),
    reminders,
    todoItems: pendingTodos.map((t) => ({
      ...t,
      dueDate: t.dueDate ? t.dueDate.toISOString().split('T')[0] : null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      completedAt: t.completedAt ? t.completedAt.toISOString() : null,
    })),
    weeklySummary: {
      completionRates,
      averageConsistency: avgConsistency,
      habitsCompleted: todaysHabits.filter((h) => h.completedToday).length,
      habitsTotal: todaysHabits.length,
      contributionsTotal: 0,
    },
  };
}
