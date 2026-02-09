// Bitmask day constants: Mon=1, Tue=2, Wed=4, Thu=8, Fri=16, Sat=32, Sun=64
export const DAYS = {
  MON: 1,
  TUE: 2,
  WED: 4,
  THU: 8,
  FRI: 16,
  SAT: 32,
  SUN: 64,
} as const;

export const ALL_DAYS = 127; // Mon-Sun
export const WEEKDAYS = DAYS.MON | DAYS.TUE | DAYS.WED | DAYS.THU | DAYS.FRI; // 31
export const WEEKENDS = DAYS.SAT | DAYS.SUN; // 96

/** Get the bitmask value for a JS Date (0=Sunday...6=Saturday) */
export function getDayBit(date: Date): number {
  const jsDay = date.getDay(); // 0=Sun, 1=Mon, ...6=Sat
  // Map to our bitmask: Mon=1, Tue=2, Wed=4, Thu=8, Fri=16, Sat=32, Sun=64
  const mapping = [64, 1, 2, 4, 8, 16, 32]; // Sun=64, Mon=1, ...
  return mapping[jsDay];
}

/** Check if a habit is due on a given date based on its daysOfWeek bitmask */
export function isHabitDueOnDate(daysOfWeek: number, date: Date): boolean {
  return (daysOfWeek & getDayBit(date)) !== 0;
}

/** Get a "YYYY-MM-DD" string from a Date */
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** Parse "YYYY-MM-DD" to a Date at midnight UTC */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00Z');
}

/** Get dates between start and end (inclusive) */
export function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}
