'use client';

import { useState } from 'react';

type GoalStatus = 'active' | 'completed' | 'archived';
type GoalCategory = 'FITNESS' | 'EDUCATION' | 'FINANCE' | 'HEALTH';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  progress: number;
  targetDate: string;
}

const categoryColors: Record<GoalCategory, { bg: string; text: string }> = {
  FITNESS: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300' },
  EDUCATION: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  FINANCE: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
  HEALTH: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300' },
};

const categoryBarColors: Record<GoalCategory, string> = {
  FITNESS: 'bg-indigo-500',
  EDUCATION: 'bg-amber-500',
  FINANCE: 'bg-emerald-500',
  HEALTH: 'bg-rose-500',
};

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Run a half marathon',
    description: 'Complete a 21km half marathon by building up weekly mileage consistently.',
    category: 'FITNESS',
    status: 'active',
    progress: 62,
    targetDate: '2026-06-15',
  },
  {
    id: '2',
    title: 'Complete AWS certification',
    description: 'Pass the AWS Solutions Architect Associate exam with study plan.',
    category: 'EDUCATION',
    status: 'active',
    progress: 35,
    targetDate: '2026-04-30',
  },
  {
    id: '3',
    title: 'Build emergency fund',
    description: 'Save $5,000 in a dedicated emergency savings account.',
    category: 'FINANCE',
    status: 'active',
    progress: 43,
    targetDate: '2026-09-01',
  },
  {
    id: '4',
    title: 'Establish sleep routine',
    description: 'Maintain a consistent 10:30pm-6:30am sleep schedule for 60 days.',
    category: 'HEALTH',
    status: 'completed',
    progress: 100,
    targetDate: '2026-01-15',
  },
];

type FilterOption = 'all' | 'active' | 'completed' | 'archived';

export default function GoalsPage() {
  const [filter, setFilter] = useState<FilterOption>('active');

  const filters: { label: string; value: FilterOption }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Archived', value: 'archived' },
  ];

  const filteredGoals = mockGoals.filter((goal) => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Goals</h1>
        <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Goal
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--subtle-bg)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-12 text-center">
          <div className="text-4xl mb-3 opacity-40">
            <svg className="w-12 h-12 mx-auto text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <p className="text-[var(--text-secondary)] font-medium">No goals match this filter</p>
          <p className="text-[var(--text-tertiary)] text-sm mt-1">Try a different filter or create a new goal.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGoals.map((goal) => {
            const colors = categoryColors[goal.category];
            const barColor = categoryBarColors[goal.category];
            return (
              <div
                key={goal.id}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--primary)]/40 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                        {goal.category}
                      </span>
                      {goal.status === 'completed' && (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{goal.title}</h3>
                    <p className="text-sm text-[var(--text-tertiary)] mb-4">{goal.description}</p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-[var(--subtle-bg)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barColor}`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-[var(--text-primary)] w-10 text-right">
                        {goal.progress}%
                      </span>
                    </div>

                    {/* Target Date */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-[var(--text-tertiary)]">
                        Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--primary)] transition-colors mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
