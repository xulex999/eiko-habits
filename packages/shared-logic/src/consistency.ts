import { isHabitDueOnDate, toDateString, parseDate, getDateRange } from './days';

export interface ConsistencyInput {
  /** Log dates in "YYYY-MM-DD" format */
  logDates: string[];
  /** Habit's daysOfWeek bitmask */
  daysOfWeek: number;
  /** Today's date in "YYYY-MM-DD" format */
  today: string;
  /** Number of days to look back (default: 30) */
  windowDays?: number;
}

export interface ConsistencyResult {
  /** Score from 0.0 to 1.0 */
  score: number;
  /** Number of completed days in window */
  completed: number;
  /** Number of due days in window */
  due: number;
}

/**
 * Calculate a rolling consistency score for a habit.
 *
 * Score = completedDueDays / totalDueDays over the trailing window.
 * Only days where the habit was due are counted.
 */
export function calculateConsistency(input: ConsistencyInput): ConsistencyResult {
  const { logDates, daysOfWeek, today, windowDays = 30 } = input;
  const logSet = new Set(logDates);
  const todayDate = parseDate(today);

  const startDate = new Date(todayDate);
  startDate.setUTCDate(startDate.getUTCDate() - windowDays + 1);

  const range = getDateRange(startDate, todayDate);

  let due = 0;
  let completed = 0;

  for (const date of range) {
    if (isHabitDueOnDate(daysOfWeek, date)) {
      due++;
      if (logSet.has(toDateString(date))) {
        completed++;
      }
    }
  }

  return {
    score: due > 0 ? completed / due : 0,
    completed,
    due,
  };
}

/**
 * Calculate completion stats for the last 7 days.
 * Returns an array of 7 booleans (Mon-Sun) indicating completion.
 */
export function getLast7DaysCompletion(
  logDates: string[],
  daysOfWeek: number,
  today: string,
): { day: string; due: boolean; completed: boolean }[] {
  const logSet = new Set(logDates);
  const todayDate = parseDate(today);
  const startDate = new Date(todayDate);
  startDate.setUTCDate(startDate.getUTCDate() - 6);

  const range = getDateRange(startDate, todayDate);

  return range.map((date) => {
    const dateStr = toDateString(date);
    const due = isHabitDueOnDate(daysOfWeek, date);
    return {
      day: dateStr,
      due,
      completed: due && logSet.has(dateStr),
    };
  });
}
