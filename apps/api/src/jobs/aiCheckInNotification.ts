import { prisma } from '../config/database.js';
import { getAIProvider } from '../modules/ai/providers/index.js';
import { isHabitDueOnDate, getDayBit, toDateString } from '@eiko/shared-logic';
import { logger } from '../utils/logger.js';

const CHECK_IN_SYSTEM_PROMPT = `You are Eiko, the AI coach in the Eiko Habits app. Write a short, friendly push notification message (under 50 words) to encourage the user to check in on their habits. Be specific about their data. Do not use excessive punctuation.`;

/**
 * AI Check-In Notification Job
 *
 * Runs every minute. For each premium user whose aiCheckInTimes match
 * the current time (in their timezone), generates a personalized
 * check-in notification and sends it via push.
 */
export async function processAICheckInNotifications() {
  const now = new Date();

  // Find all premium users with push notifications and AI check-in times configured
  const prefs = await prisma.notificationPreference.findMany({
    where: {
      channel: 'PUSH',
      enabled: true,
      aiInsights: true,
      user: {
        subscription: { tier: 'PREMIUM', status: 'ACTIVE' },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          timezone: true,
          devices: { where: { pushToken: { not: null } } },
        },
      },
    },
  });

  for (const pref of prefs) {
    const aiCheckInTimes = (pref.aiCheckInTimes as string[]) || [];
    if (aiCheckInTimes.length === 0) continue;

    // Convert current UTC time to user's timezone
    const userTime = now.toLocaleTimeString('en-US', {
      timeZone: pref.user.timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    // Check if current time matches any configured check-in time
    const shouldNotify = aiCheckInTimes.some((time) => time === userTime);
    if (!shouldNotify) continue;

    // Skip if user has no push devices
    if (pref.user.devices.length === 0) continue;

    try {
      // Get user's habit context
      const today = new Date();
      const todayStr = toDateString(today);
      const dayBit = getDayBit(today);

      const habits = await prisma.habit.findMany({
        where: { userId: pref.user.id, isActive: true },
        select: { id: true, title: true, daysOfWeek: true, currentStreak: true },
      });

      const dueHabits = habits.filter((h) => (h.daysOfWeek & dayBit) !== 0);

      const todayLogs = await prisma.habitLog.findMany({
        where: {
          habitId: { in: dueHabits.map((h) => h.id) },
          date: new Date(todayStr + 'T00:00:00Z'),
        },
        select: { habitId: true },
      });

      const completedIds = new Set(todayLogs.map((l) => l.habitId));
      const remaining = dueHabits.filter((h) => !completedIds.has(h.id));
      const completed = dueHabits.filter((h) => completedIds.has(h.id));

      // Generate AI message
      const userPrompt = `User: ${pref.user.displayName}
Due today: ${dueHabits.map((h) => h.title).join(', ')}
Completed: ${completed.map((h) => h.title).join(', ') || 'none yet'}
Remaining: ${remaining.map((h) => h.title).join(', ') || 'all done!'}
Top streak: ${habits.sort((a, b) => b.currentStreak - a.currentStreak)[0]?.title || 'none'} (${habits[0]?.currentStreak || 0} days)

Write a personalized push notification.`;

      const provider = getAIProvider();
      const result = await provider.generateText({
        systemPrompt: CHECK_IN_SYSTEM_PROMPT,
        userPrompt,
        maxTokens: 100,
      });

      // Send push notification via Expo Push API
      const pushTokens = pref.user.devices
        .map((d) => d.pushToken)
        .filter(Boolean) as string[];

      if (pushTokens.length > 0) {
        await sendExpoPush(pushTokens, {
          title: 'Eiko Habits',
          body: result.text.trim(),
          data: { screen: 'check-in' },
        });
      }

      logger.info({ userId: pref.user.id }, 'AI check-in notification sent');
    } catch (err) {
      logger.error({ err, userId: pref.user.id }, 'Failed to send AI check-in notification');
    }
  }
}

async function sendExpoPush(
  pushTokens: string[],
  message: { title: string; body: string; data?: Record<string, string> },
) {
  const accessToken = process.env.EXPO_ACCESS_TOKEN;

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(
      pushTokens.map((token) => ({
        to: token,
        title: message.title,
        body: message.body,
        data: message.data,
        sound: 'default',
      })),
    ),
  });
}
