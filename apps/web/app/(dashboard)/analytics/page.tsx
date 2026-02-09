'use client';

import { useState } from 'react';

type Period = '7d' | '30d' | '90d';

const periodLabels: Record<Period, string> = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
};

const weeklyData = [
  { label: 'Mon', value: 85 },
  { label: 'Tue', value: 92 },
  { label: 'Wed', value: 78 },
  { label: 'Thu', value: 65 },
  { label: 'Fri', value: 90 },
  { label: 'Sat', value: 100 },
  { label: 'Sun', value: 55 },
];

const topHabits = [
  { title: 'Meditate 10 min', consistency: 95, streak: 30, color: '#F59E0B' },
  { title: 'Weekly meal prep', consistency: 90, streak: 8, color: '#8B5CF6' },
  { title: 'Morning Workout', consistency: 87, streak: 12, color: '#4F46E5' },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');

  const stats = [
    { label: 'Completion Rate', value: '82%', color: 'text-[var(--primary)]' },
    { label: 'Current Streak', value: '30 days', color: 'text-[var(--streak)]' },
    { label: 'Habits Tracked', value: '4', color: 'text-[var(--text-primary)]' },
    { label: 'Goals Progress', value: '45%', color: 'text-[var(--finance)]' },
  ];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Analytics</h1>

        {/* Period Selector */}
        <div className="flex bg-[var(--subtle-bg)] rounded-lg p-1">
          {(Object.entries(periodLabels) as [Period, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                period === key
                  ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-sm text-[var(--text-tertiary)] mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly Completion Trend */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Weekly Completion Trend</h2>

        <div className="flex items-end justify-between gap-3 h-48">
          {weeklyData.map((day) => (
            <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-[var(--text-secondary)]">{day.value}%</span>
              <div className="w-full bg-[var(--subtle-bg)] rounded-t-md overflow-hidden relative" style={{ height: '160px' }}>
                <div
                  className="absolute bottom-0 w-full bg-[var(--primary)] rounded-t-md transition-all hover:opacity-80"
                  style={{ height: `${day.value}%` }}
                />
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Habits */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Top Performing Habits</h2>
        <div className="space-y-4">
          {topHabits.map((habit, index) => (
            <div key={habit.title} className="flex items-center gap-4">
              {/* Rank */}
              <div className="w-8 h-8 rounded-full bg-[var(--subtle-bg)] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[var(--text-secondary)]">{index + 1}</span>
              </div>

              {/* Color Dot + Info */}
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: habit.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{habit.title}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{habit.streak} day streak</p>
              </div>

              {/* Consistency Bar */}
              <div className="flex items-center gap-2 w-32">
                <div className="flex-1 h-1.5 bg-[var(--subtle-bg)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--primary)] transition-all"
                    style={{ width: `${habit.consistency}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-[var(--text-primary)] w-10 text-right">
                  {habit.consistency}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
