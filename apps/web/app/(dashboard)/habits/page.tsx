'use client';

import { useState } from 'react';

interface Habit {
  id: string;
  title: string;
  frequency: string;
  streak: number;
  consistency: number;
  color: string;
  active: boolean;
}

const mockHabits: Habit[] = [
  { id: '1', title: 'Morning Workout', frequency: 'Daily', streak: 12, consistency: 87, color: '#4F46E5', active: true },
  { id: '2', title: 'Meditate 10 min', frequency: 'Daily', streak: 30, consistency: 95, color: '#F59E0B', active: true },
  { id: '3', title: 'Read 20 minutes', frequency: 'Daily', streak: 5, consistency: 72, color: '#10B981', active: true },
  { id: '4', title: 'Drink 8 glasses of water', frequency: 'Daily', streak: 3, consistency: 64, color: '#F43F5E', active: true },
  { id: '5', title: 'Weekly meal prep', frequency: 'Weekly', streak: 8, consistency: 90, color: '#8B5CF6', active: false },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState(mockHabits);

  const activeHabits = habits.filter((h) => h.active);
  const avgConsistency = activeHabits.length
    ? Math.round(activeHabits.reduce((sum, h) => sum + h.consistency, 0) / activeHabits.length)
    : 0;
  const bestStreak = Math.max(...habits.map((h) => h.streak));

  const toggleActive = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, active: !h.active } : h))
    );
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Habits</h1>
        <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Habit
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-sm text-[var(--text-tertiary)] mb-1">Total Active</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{activeHabits.length}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-sm text-[var(--text-tertiary)] mb-1">Average Consistency</p>
          <p className="text-2xl font-bold text-[var(--primary)]">{avgConsistency}%</p>
        </div>
        <div className="bg-[var(--streak-light)] border border-[var(--streak)]/20 rounded-xl p-5">
          <p className="text-sm text-[var(--text-tertiary)] mb-1">Best Streak</p>
          <p className="text-2xl font-bold text-[var(--streak)]">{bestStreak} days</p>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 transition-colors ${
              !habit.active ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Color Dot */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: habit.color }}
              />

              {/* Title + Frequency */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{habit.title}</h3>
                <p className="text-sm text-[var(--text-tertiary)]">{habit.frequency}</p>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1.5 text-[var(--streak)]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 23c-3.6 0-8-3.14-8-9.61C4 7.89 9 2.57 12 1c3 1.57 8 6.89 8 12.39C20 19.86 15.6 23 12 23zm0-19.5C9.82 5.32 6 9.66 6 13.39 6 18.36 9.07 21 12 21s6-2.64 6-7.61C18 9.66 14.18 5.32 12 3.5z" />
                </svg>
                <span className="text-sm font-semibold">{habit.streak}</span>
              </div>

              {/* Consistency */}
              <div className="hidden sm:flex items-center gap-2 min-w-[80px]">
                <div className="flex-1 h-1.5 bg-[var(--subtle-bg)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--primary)] transition-all"
                    style={{ width: `${habit.consistency}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[var(--text-secondary)] w-8 text-right">
                  {habit.consistency}%
                </span>
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggleActive(habit.id)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                  habit.active ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                }`}
                role="switch"
                aria-checked={habit.active}
                aria-label={`Toggle ${habit.title}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition ${
                    habit.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
