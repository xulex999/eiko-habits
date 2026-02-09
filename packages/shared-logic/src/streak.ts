import { isHabitDueOnDate, toDateString, parseDate } from './days';

export interface StreakInput {
  /** Sorted log dates in "YYYY-MM-DD" format (ascending) */
  logDates: string[];
  /** Habit's daysOfWeek bitmask */
  daysOfWeek: number;
  /** Today's date in "YYYY-MM-DD" format */
  today: string;
}

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Calculate current and longest streaks for a habit.
 *
 * A streak counts consecutive "due" days that have a log entry.
 * Non-due days (e.g., weekends for a weekday habit) are skipped
 * and do not break the streak.
 */
export function calculateStreak(input: StreakInput): StreakResult {
  const { logDates, daysOfWeek, today } = input;
  const logSet = new Set(logDates);
  const todayDate = parseDate(today);

  // Walk backwards from today to find current streak
  let currentStreak = 0;
  const cursor = new Date(todayDate);

  // Allow up to 366 days lookback
  for (let i = 0; i < 366; i++) {
    const dateStr = toDateString(cursor);
    const isDue = isHabitDueOnDate(daysOfWeek, cursor);

    if (isDue) {
      if (logSet.has(dateStr)) {
        currentStreak++;
      } else {
        break; // Missed a due day — streak broken
      }
    }
    // Move to previous day
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  // Calculate longest streak by walking forward through all log dates
  let longestStreak = 0;
  let tempStreak = 0;

  if (logDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const firstLog = parseDate(logDates[0]);
  const walkCursor = new Date(firstLog);

  while (walkCursor <= todayDate) {
    const dateStr = toDateString(walkCursor);
    const isDue = isHabitDueOnDate(daysOfWeek, walkCursor);

    if (isDue) {
      if (logSet.has(dateStr)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    walkCursor.setUTCDate(walkCursor.getUTCDate() + 1);
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
}
