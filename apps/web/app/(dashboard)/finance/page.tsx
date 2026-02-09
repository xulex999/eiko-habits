'use client';

import { useState } from 'react';

type FinanceType = 'savings' | 'debt' | 'budget';
type PaceStatus = 'on_track' | 'ahead' | 'behind';

interface FinanceGoal {
  id: string;
  title: string;
  type: FinanceType;
  current: number;
  target: number;
  pace: PaceStatus;
  targetDate: string;
  description: string;
}

const paceConfig: Record<PaceStatus, { label: string; bgClass: string; textClass: string }> = {
  on_track: { label: 'On Track', bgClass: 'bg-emerald-100 dark:bg-emerald-900/30', textClass: 'text-emerald-700 dark:text-emerald-300' },
  ahead: { label: 'Ahead', bgClass: 'bg-emerald-100 dark:bg-emerald-900/30', textClass: 'text-emerald-700 dark:text-emerald-300' },
  behind: { label: 'Behind', bgClass: 'bg-rose-100 dark:bg-rose-900/30', textClass: 'text-rose-700 dark:text-rose-300' },
};

const mockFinanceGoals: FinanceGoal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    type: 'savings',
    current: 2150,
    target: 5000,
    pace: 'on_track',
    targetDate: '2026-09-01',
    description: 'Build a 3-month emergency fund for unexpected expenses.',
  },
  {
    id: '2',
    title: 'Credit Card',
    type: 'debt',
    current: 1400,
    target: 3200,
    pace: 'ahead',
    targetDate: '2026-07-15',
    description: 'Pay off credit card balance completely.',
  },
  {
    id: '3',
    title: 'Monthly Budget',
    type: 'budget',
    current: 2500,
    target: 4000,
    pace: 'on_track',
    targetDate: '2026-02-28',
    description: 'Stay within monthly spending budget across all categories.',
  },
];

type TabFilter = 'all' | 'savings' | 'debt' | 'budget';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
}

export default function FinancePage() {
  const [tab, setTab] = useState<TabFilter>('all');

  const tabs: { label: string; value: TabFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Savings', value: 'savings' },
    { label: 'Debt', value: 'debt' },
    { label: 'Budget', value: 'budget' },
  ];

  const filteredGoals = mockFinanceGoals.filter((g) => {
    if (tab === 'all') return true;
    return g.type === tab;
  });

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Finance</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--finance-light)] border border-[var(--finance)]/20 rounded-xl p-5">
          <p className="text-sm text-[var(--text-tertiary)] mb-1">Total Savings</p>
          <p className="text-2xl font-bold text-[var(--finance)]">{formatCurrency(2150)}</p>
        </div>
        <div className="bg-[var(--destructive-light)] border border-[var(--destructive)]/20 rounded-xl p-5">
          <p className="text-sm text-[var(--text-tertiary)] mb-1">Debt Remaining</p>
          <p className="text-2xl font-bold text-[var(--destructive)]">{formatCurrency(1400)}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-sm text-[var(--text-tertiary)] mb-1">Monthly Budget</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(2500)}</span>
            <span className="text-sm text-[var(--text-tertiary)]">of {formatCurrency(4000)}</span>
          </div>
          <div className="mt-2 h-1.5 bg-[var(--subtle-bg)] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: '62.5%' }} />
          </div>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === t.value
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--subtle-bg)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Financial Goals */}
      <div className="space-y-3">
        {filteredGoals.map((goal) => {
          const progress = goal.type === 'debt'
            ? ((goal.target - goal.current) / goal.target) * 100
            : (goal.current / goal.target) * 100;
          const pace = paceConfig[goal.pace];

          return (
            <div
              key={goal.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--primary)]/40 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{goal.title}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${pace.bgClass} ${pace.textClass}`}>
                      {pace.label}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)]">{goal.description}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--subtle-bg)] text-[var(--text-secondary)] capitalize flex-shrink-0 ml-4">
                  {goal.type}
                </span>
              </div>

              {/* Amount + Progress */}
              <div className="mt-4">
                <div className="flex items-baseline justify-between mb-2">
                  {goal.type === 'debt' ? (
                    <p className="text-sm text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--destructive)]">{formatCurrency(goal.current)}</span>
                      <span className="text-[var(--text-tertiary)]"> remaining of {formatCurrency(goal.target)}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--finance)]">{formatCurrency(goal.current)}</span>
                      <span className="text-[var(--text-tertiary)]"> / {formatCurrency(goal.target)}</span>
                    </p>
                  )}
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-[var(--subtle-bg)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      goal.type === 'debt' ? 'bg-[var(--destructive)]' : 'bg-[var(--finance)]'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
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
          );
        })}
      </div>
    </div>
  );
}
