import type { PaceStatus } from '@eiko/shared-types';

export interface ForecastInput {
  /** Current amount accumulated */
  currentAmount: number;
  /** Target amount to reach */
  targetAmount: number;
  /** Start date "YYYY-MM-DD" */
  startDate: string;
  /** Target/deadline date "YYYY-MM-DD" (optional) */
  targetDate?: string;
  /** Today's date "YYYY-MM-DD" */
  today: string;
  /** Historical contributions: { date: string, amount: number }[] */
  contributions: { date: string; amount: number }[];
  /** Annual interest rate (for debt payoff calculations) */
  interestRate?: number;
}

export interface ForecastResult {
  /** Projected date of completion at current pace */
  projectedCompletionDate: string | null;
  /** Whether user is ahead, on track, or behind */
  paceStatus: PaceStatus;
  /** Amount needed per month to meet deadline */
  requiredMonthlyAmount: number;
  /** Amount needed per week to meet deadline */
  requiredWeeklyAmount: number;
  /** Amount needed per day to meet deadline */
  requiredDailyAmount: number;
  /** Average monthly contribution based on recent data */
  averageMonthlyPace: number;
  /** Days remaining until deadline (null if no deadline) */
  daysRemaining: number | null;
  /** Percent of target completed (0-100) */
  percentComplete: number;
  /** Confidence level based on data availability */
  confidenceLevel: 'high' | 'medium' | 'low';
}

/**
 * Calculate time-to-goal forecast based on historical pace.
 *
 * Uses trailing 30-day average contribution rate to project completion.
 * For debt with interest, factors in monthly interest accrual.
 */
export function calculateForecast(input: ForecastInput): ForecastResult {
  const { currentAmount, targetAmount, startDate, targetDate, today, contributions, interestRate } =
    input;

  const todayDate = new Date(today + 'T00:00:00Z');
  const startDateObj = new Date(startDate + 'T00:00:00Z');
  const targetDateObj = targetDate ? new Date(targetDate + 'T00:00:00Z') : null;

  const remaining = targetAmount - currentAmount;
  const percentComplete = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

  // Calculate days remaining until deadline
  const daysRemaining = targetDateObj
    ? Math.max(0, Math.ceil((targetDateObj.getTime() - todayDate.getTime()) / 86400000))
    : null;

  // Calculate required rates to meet deadline
  let requiredDailyAmount = 0;
  let requiredWeeklyAmount = 0;
  let requiredMonthlyAmount = 0;

  if (daysRemaining !== null && daysRemaining > 0 && remaining > 0) {
    if (interestRate && interestRate > 0) {
      // For debt: factor in monthly interest accrual
      const monthlyRate = interestRate / 12 / 100;
      const monthsRemaining = daysRemaining / 30;
      // PMT formula for remaining debt
      if (monthlyRate > 0 && monthsRemaining > 0) {
        requiredMonthlyAmount =
          (remaining * monthlyRate * Math.pow(1 + monthlyRate, monthsRemaining)) /
          (Math.pow(1 + monthlyRate, monthsRemaining) - 1);
      }
    } else {
      requiredMonthlyAmount = remaining / (daysRemaining / 30);
    }
    requiredWeeklyAmount = remaining / (daysRemaining / 7);
    requiredDailyAmount = remaining / daysRemaining;
  }

  // Calculate average pace from last 30 days of contributions
  const thirtyDaysAgo = new Date(todayDate);
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

  const recentContributions = contributions.filter((c) => {
    const cDate = new Date(c.date + 'T00:00:00Z');
    return cDate >= thirtyDaysAgo && cDate <= todayDate;
  });

  const totalRecent = recentContributions.reduce((sum, c) => sum + Math.abs(c.amount), 0);

  // Days since start or 30, whichever is smaller
  const daysSinceStart = Math.ceil(
    (todayDate.getTime() - startDateObj.getTime()) / 86400000,
  );
  const lookbackDays = Math.min(30, Math.max(1, daysSinceStart));
  const averageDailyPace = totalRecent / lookbackDays;
  const averageMonthlyPace = averageDailyPace * 30;

  // Confidence level based on data availability
  let confidenceLevel: 'high' | 'medium' | 'low' = 'low';
  if (recentContributions.length >= 10) confidenceLevel = 'high';
  else if (recentContributions.length >= 3) confidenceLevel = 'medium';

  // Project completion date at current pace
  let projectedCompletionDate: string | null = null;
  if (averageDailyPace > 0 && remaining > 0) {
    const daysToComplete = remaining / averageDailyPace;
    const projDate = new Date(todayDate);
    projDate.setUTCDate(projDate.getUTCDate() + Math.ceil(daysToComplete));
    projectedCompletionDate = projDate.toISOString().split('T')[0];
  }

  // Determine pace status
  let paceStatus: PaceStatus = 'on_track';
  if (targetDateObj) {
    if (projectedCompletionDate) {
      const projDate = new Date(projectedCompletionDate + 'T00:00:00Z');
      const bufferDays = 3; // 3-day buffer for "on track"
      if (projDate.getTime() < targetDateObj.getTime() - bufferDays * 86400000) {
        paceStatus = 'ahead';
      } else if (projDate.getTime() > targetDateObj.getTime() + bufferDays * 86400000) {
        paceStatus = 'behind';
      }
    } else if (remaining > 0) {
      paceStatus = 'behind'; // No pace data and still have remaining
    }
  }

  // If already complete
  if (remaining <= 0) {
    paceStatus = 'ahead';
  }

  return {
    projectedCompletionDate,
    paceStatus,
    requiredMonthlyAmount: Math.round(requiredMonthlyAmount * 100) / 100,
    requiredWeeklyAmount: Math.round(requiredWeeklyAmount * 100) / 100,
    requiredDailyAmount: Math.round(requiredDailyAmount * 100) / 100,
    averageMonthlyPace: Math.round(averageMonthlyPace * 100) / 100,
    daysRemaining,
    percentComplete: Math.round(percentComplete * 100) / 100,
    confidenceLevel,
  };
}
