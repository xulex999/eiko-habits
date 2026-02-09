import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../utils/errors.js';
import { getAIProvider } from './providers/index.js';
import { toDateString } from '@eiko/shared-logic';

// Prompt templates
const HABIT_ROUTINE_SYSTEM = `You are Eiko, an AI habit coach for the Eiko Habits app. Generate a personalized routine based on the user's goals and habits. Be specific, actionable, and encouraging. Format as markdown with clear steps.`;

const FINANCIAL_PLAN_SYSTEM = `You are Eiko, a financial wellness coach for the Eiko Habits app. Create a realistic, step-by-step action plan to reach the user's financial goal. Include specific weekly/monthly actions. Format as markdown.`;

const WEEKLY_REVIEW_SYSTEM = `You are Eiko, a personal progress coach for the Eiko Habits app. Summarize the user's week: celebrate wins, note areas for improvement, suggest adjustments for next week. Be encouraging but honest. Format as markdown.`;

const CHAT_SYSTEM = `You are Eiko, the AI coach inside Eiko Habits. Help users with habit building, financial planning, and goal achievement. Be concise, actionable, and supportive. Keep responses under 300 words.`;

export async function getRecommendations(userId: string) {
  return prisma.aIRecommendation.findMany({
    where: { userId, isDismissed: false },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}

export async function dismissRecommendation(userId: string, recId: string) {
  const rec = await prisma.aIRecommendation.findFirst({
    where: { id: recId, userId },
  });
  if (!rec) throw new NotFoundError('Recommendation');

  return prisma.aIRecommendation.update({
    where: { id: recId },
    data: { isDismissed: true },
  });
}

export async function generateHabitRoutine(
  userId: string,
  input: { focusAreas?: string[]; timeOfDay?: string },
) {
  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true },
    select: { title: true, frequency: true, currentStreak: true, consistencyScore: true },
  });

  const goals = await prisma.goal.findMany({
    where: { userId, status: 'ACTIVE' },
    select: { title: true, category: true, currentValue: true, targetValue: true },
  });

  const userPrompt = `Here are my current habits and goals:

Habits:
${habits.map((h) => `- ${h.title} (${h.frequency}, streak: ${h.currentStreak}, consistency: ${Math.round(h.consistencyScore * 100)}%)`).join('\n')}

Goals:
${goals.map((g) => `- ${g.title} (${g.category}${g.targetValue ? `, progress: ${g.currentValue}/${g.targetValue}` : ''})`).join('\n')}

${input.focusAreas?.length ? `Focus areas: ${input.focusAreas.join(', ')}` : ''}
${input.timeOfDay ? `Time of day: ${input.timeOfDay}` : ''}

Please generate a personalized ${input.timeOfDay || 'daily'} routine for me.`;

  const provider = getAIProvider();
  const result = await provider.generateText({
    systemPrompt: HABIT_ROUTINE_SYSTEM,
    userPrompt,
    maxTokens: 800,
  });

  const rec = await prisma.aIRecommendation.create({
    data: {
      userId,
      type: 'HABIT_ROUTINE',
      title: `${input.timeOfDay ? input.timeOfDay.charAt(0).toUpperCase() + input.timeOfDay.slice(1) : 'Daily'} Routine`,
      content: result.text,
      metadata: { provider: 'ai', tokensUsed: result.tokensUsed },
    },
  });

  return rec;
}

export async function generateFinancialPlan(
  userId: string,
  input: { financialGoalId?: string },
) {
  const goals = input.financialGoalId
    ? await prisma.financialGoal.findMany({
        where: { id: input.financialGoalId, userId },
        include: { contributions: { orderBy: { date: 'desc' }, take: 10 } },
      })
    : await prisma.financialGoal.findMany({
        where: { userId, isActive: true },
        include: { contributions: { orderBy: { date: 'desc' }, take: 5 } },
      });

  const userPrompt = `Here are my financial goals:

${goals
  .map(
    (g) =>
      `- ${g.title} (${g.type}): $${g.currentAmount}/$${g.targetAmount}${g.targetDate ? `, deadline: ${g.targetDate.toISOString().split('T')[0]}` : ''}${g.interestRate ? `, ${g.interestRate}% interest` : ''}
  Recent activity: ${g.contributions.map((c) => `${c.type} $${c.amount} on ${c.date.toISOString().split('T')[0]}`).join(', ') || 'none'}`,
  )
  .join('\n\n')}

Please create a realistic action plan to help me reach ${input.financialGoalId ? 'this goal' : 'these goals'}.`;

  const provider = getAIProvider();
  const result = await provider.generateText({
    systemPrompt: FINANCIAL_PLAN_SYSTEM,
    userPrompt,
    maxTokens: 800,
  });

  return prisma.aIRecommendation.create({
    data: {
      userId,
      type: 'FINANCIAL_PLAN',
      title: 'Financial Action Plan',
      content: result.text,
      metadata: { provider: 'ai', tokensUsed: result.tokensUsed },
    },
  });
}

export async function generateWeeklyReview(userId: string) {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [habits, habitLogs, contributions, goals] = await Promise.all([
    prisma.habit.findMany({
      where: { userId, isActive: true },
      select: { title: true, currentStreak: true, consistencyScore: true },
    }),
    prisma.habitLog.count({
      where: {
        habit: { userId },
        date: { gte: weekAgo, lte: today },
        skipped: false,
      },
    }),
    prisma.contribution.findMany({
      where: {
        financialGoal: { userId },
        date: { gte: weekAgo, lte: today },
      },
      select: { amount: true, type: true },
    }),
    prisma.goal.findMany({
      where: { userId, status: 'ACTIVE' },
      select: { title: true, currentValue: true, targetValue: true },
    }),
  ]);

  const totalContributed = contributions
    .filter((c) => c.type === 'DEPOSIT' || c.type === 'PAYMENT')
    .reduce((sum, c) => sum + Number(c.amount), 0);

  const userPrompt = `Here's my week in review:

Habits (${habits.length} active):
${habits.map((h) => `- ${h.title}: ${h.currentStreak} day streak, ${Math.round(h.consistencyScore * 100)}% consistency`).join('\n')}
Total check-ins this week: ${habitLogs}

Financial:
- Total contributed: $${totalContributed.toFixed(2)}
- ${contributions.length} transactions

Active Goals:
${goals.map((g) => `- ${g.title}${g.targetValue ? `: ${g.currentValue}/${g.targetValue}` : ''}`).join('\n')}

Please give me my weekly review.`;

  const provider = getAIProvider();
  const result = await provider.generateText({
    systemPrompt: WEEKLY_REVIEW_SYSTEM,
    userPrompt,
    maxTokens: 600,
  });

  return prisma.aIRecommendation.create({
    data: {
      userId,
      type: 'WEEKLY_REVIEW',
      title: `Week of ${weekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      content: result.text,
      metadata: { provider: 'ai', tokensUsed: result.tokensUsed },
    },
  });
}

export async function chat(userId: string, message: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { displayName: true },
  });

  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true },
    select: { title: true, currentStreak: true },
    take: 5,
  });

  const contextPrompt = `User: ${user?.displayName || 'User'}
Active habits: ${habits.map((h) => `${h.title} (${h.currentStreak}d streak)`).join(', ') || 'none'}

User message: ${message}`;

  const provider = getAIProvider();
  const result = await provider.generateText({
    systemPrompt: CHAT_SYSTEM,
    userPrompt: contextPrompt,
    maxTokens: 500,
  });

  return { text: result.text, tokensUsed: result.tokensUsed };
}
