'use client';

import { useState, useEffect } from 'react';
import { getGreeting, formatPercent } from '@eiko/shared-logic';

// Placeholder dashboard — in production, fetches from /api/v1/dashboard/overview
export default function DashboardPage() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  // Mock data for demonstration
  const habits = [
    { id: '1', title: 'Morning workout', completed: true, streak: 12 },
    { id: '2', title: 'Meditate 10 min', completed: true, streak: 30 },
    { id: '3', title: 'Read 20 minutes', completed: false, streak: 5 },
    { id: '4', title: 'Drink 8 glasses of water', completed: false, streak: 3 },
  ];

  const weekData = [0.8, 1.0, 0.75, 0.6, 0.9, 1.0, 0.5];
  const avgConsistency = weekData.reduce((a, b) => a + b, 0) / weekData.length;

  return (
    <div className="max-w-5xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {greeting}, User
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Habits — takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Today's Habits</h2>
              <span className="bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 rounded-full text-sm font-medium">
                {habits.filter(h => h.completed).length} of {habits.length}
              </span>
            </div>

            <div className="space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--subtle-bg)] transition cursor-pointer"
                >
                  <button
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${
                      habit.completed
                        ? 'bg-[var(--primary)] border-[var(--primary)]'
                        : 'border-[var(--border)] hover:border-[var(--primary)]'
                    }`}
                    aria-label={`Mark ${habit.title} as ${habit.completed ? 'incomplete' : 'complete'}`}
                  >
                    {habit.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <span className={`text-[var(--text-primary)] ${habit.completed ? 'line-through opacity-50' : ''}`}>
                      {habit.title}
                    </span>
                  </div>
                  {habit.streak > 0 && (
                    <span className="text-sm text-[var(--streak)] flex items-center gap-1">
                      🔥 {habit.streak}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Stats */}
        <div className="space-y-6">
          {/* Streak Highlight */}
          <div className="bg-[var(--streak-light)] border border-[var(--streak)]/20 rounded-xl p-6">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">30 days</p>
            <p className="text-sm text-[var(--text-secondary)]">Meditation streak</p>
          </div>

          {/* Weekly Summary */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">This Week</h3>
            <div className="flex justify-between items-end h-20 mb-3">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-6 bg-[var(--subtle-bg)] rounded overflow-hidden" style={{ height: 48 }}>
                    <div
                      className="w-full bg-[var(--primary)] rounded transition-all"
                      style={{ height: `${weekData[i] * 100}%`, marginTop: 'auto' }}
                    />
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)]">{day}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-[var(--text-secondary)]">
              {formatPercent(avgConsistency)} consistency
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Active Goals</span>
                <span className="font-semibold text-[var(--text-primary)]">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Savings Progress</span>
                <span className="font-semibold text-[var(--finance)]">$2,150</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Debt Remaining</span>
                <span className="font-semibold text-[var(--destructive)]">$1,400</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
