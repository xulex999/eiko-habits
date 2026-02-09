'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface DashboardData {
  greeting: string;
  displayName: string;
  tier: 'FREE' | 'PREMIUM';
  todaysHabits: Array<{
    id: string;
    title: string;
    color: string;
    currentStreak: number;
    completedToday: boolean;
  }>;
  activeGoalsCount: number;
  currentStreakHighlight: { habitTitle: string; streakDays: number } | null;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    type: 'goal' | 'financial';
    daysRemaining: number;
    percentComplete: number;
  }>;
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }>;
  recentJournalEntries: Array<{
    id: string;
    title: string | null;
    content: string;
    mood: number | null;
    date: string;
  }>;
  reminders: Array<{
    id: string;
    title: string;
    message: string;
    type: 'habit' | 'goal' | 'financial' | 'ai';
    urgency: 'low' | 'medium' | 'high';
  }>;
  todoItems: Array<{
    id: string;
    title: string;
    description: string | null;
    source: 'USER' | 'AI_GENERATED';
    status: string;
  }>;
  weeklySummary: {
    completionRates: number[];
    averageConsistency: number;
    habitsCompleted: number;
    habitsTotal: number;
  };
}

const MOOD_EMOJIS = ['', '😞', '😐', '🙂', '😊', '🤩'];

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Journal state
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<number | null>(null);
  const [journalSaving, setJournalSaving] = useState(false);

  // Todo state
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [showAddTodo, setShowAddTodo] = useState(false);

  // Entry modal
  const [showEntryModal, setShowEntryModal] = useState(false);

  // AI loading states
  const [aiTodosLoading, setAiTodosLoading] = useState(false);
  const [aiRemindersLoading, setAiRemindersLoading] = useState(false);

  const getToken = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return null;
    }
    return token;
  }, [router]);

  const fetchDashboard = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/v1/dashboard/overview`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (res.status === 401) {
        localStorage.removeItem('accessToken');
        router.push('/login');
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error?.message || 'Failed to load dashboard');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [getToken, router]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  async function apiCall(path: string, method = 'POST', body?: unknown) {
    const token = getToken();
    if (!token) return null;
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  }

  async function handleCheckIn(habitId: string, completed: boolean) {
    if (completed) return; // Already completed
    const result = await apiCall(`/api/v1/habits/${habitId}/check-in`, 'POST', { value: 1 });
    if (result?.success) {
      fetchDashboard();
    }
  }

  async function handleJournalSubmit() {
    if (!journalContent.trim()) return;
    setJournalSaving(true);
    const result = await apiCall('/api/v1/journal', 'POST', {
      content: journalContent,
      mood: journalMood,
    });
    if (result?.success) {
      setJournalContent('');
      setJournalMood(null);
      fetchDashboard();
    }
    setJournalSaving(false);
  }

  async function handleTodoToggle(todoId: string) {
    const result = await apiCall(`/api/v1/todos/${todoId}`, 'PATCH', { status: 'COMPLETED' });
    if (result?.success) {
      fetchDashboard();
    }
  }

  async function handleAddTodo() {
    if (!newTodoTitle.trim()) return;
    const result = await apiCall('/api/v1/todos', 'POST', { title: newTodoTitle });
    if (result?.success) {
      setNewTodoTitle('');
      setShowAddTodo(false);
      fetchDashboard();
    }
  }

  async function handleMarkAllNotificationsRead() {
    await apiCall('/api/v1/notifications/read-all', 'POST');
    fetchDashboard();
  }

  async function handleGenerateAiTodos() {
    setAiTodosLoading(true);
    const result = await apiCall('/api/v1/ai/daily-todos', 'POST');
    if (result?.success) {
      fetchDashboard();
    }
    setAiTodosLoading(false);
  }

  async function handleGenerateSmartReminders() {
    setAiRemindersLoading(true);
    const result = await apiCall('/api/v1/ai/smart-reminders', 'POST');
    if (result?.success) {
      fetchDashboard();
    }
    setAiRemindersLoading(false);
  }

  if (loading) {
    return (
      <div className="max-w-5xl animate-pulse">
        <div className="h-10 w-64 bg-[var(--subtle-bg)] rounded-lg mb-2" />
        <div className="h-5 w-48 bg-[var(--subtle-bg)] rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-16 bg-[var(--subtle-bg)] rounded-xl" />
            <div className="h-64 bg-[var(--subtle-bg)] rounded-xl" />
            <div className="h-48 bg-[var(--subtle-bg)] rounded-xl" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-[var(--subtle-bg)] rounded-xl" />
            <div className="h-48 bg-[var(--subtle-bg)] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl">
        <div className="bg-[var(--destructive-light)] text-[var(--destructive)] p-4 rounded-xl">
          {error || 'Failed to load dashboard'}
        </div>
        <button onClick={() => { setError(''); setLoading(true); fetchDashboard(); }} className="mt-4 text-[var(--primary)] font-medium">
          Try again
        </button>
      </div>
    );
  }

  const isPremium = data.tier === 'PREMIUM';

  return (
    <div className="max-w-5xl relative">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {data.greeting}, {data.displayName}
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============ LEFT COLUMN (2/3) ============ */}
        <div className="lg:col-span-2 space-y-6">

          {/* Notifications Bar */}
          {data.notifications.length > 0 && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    Notifications
                    <span className="ml-2 bg-[var(--primary)] text-white text-xs px-2 py-0.5 rounded-full">
                      {data.notifications.length}
                    </span>
                  </h3>
                </div>
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="text-xs text-[var(--primary)] hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-2">
                {data.notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[var(--subtle-bg)] transition">
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                      n.type === 'AI_INSIGHT' ? 'bg-[var(--primary)]' :
                      n.type === 'STREAK_MILESTONE' ? 'bg-[var(--streak)]' :
                      n.type === 'FINANCIAL_ALERT' ? 'bg-[var(--finance)]' :
                      'bg-[var(--text-tertiary)]'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{n.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">{n.message}</p>
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)] flex-shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Habits */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Today&apos;s Habits</h2>
              <span className="bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 rounded-full text-sm font-medium">
                {data.todaysHabits.filter(h => h.completedToday).length} of {data.todaysHabits.length}
              </span>
            </div>

            {data.todaysHabits.length === 0 ? (
              <p className="text-[var(--text-tertiary)] text-center py-4">No habits due today</p>
            ) : (
              <div className="space-y-3">
                {data.todaysHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--subtle-bg)] transition cursor-pointer"
                    onClick={() => handleCheckIn(habit.id, habit.completedToday)}
                  >
                    <button
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${
                        habit.completedToday
                          ? 'bg-[var(--primary)] border-[var(--primary)]'
                          : 'border-[var(--border)] hover:border-[var(--primary)]'
                      }`}
                    >
                      {habit.completedToday && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <span className={`text-[var(--text-primary)] ${habit.completedToday ? 'line-through opacity-50' : ''}`}>
                        {habit.title}
                      </span>
                    </div>
                    {habit.currentStreak > 0 && (
                      <span className="text-sm text-[var(--streak)] flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 23c-3.5 0-7-2.5-7-7 0-3 2-5.5 4-7.5 1-1 1.5-2.5 1.5-4C10.5 4 11 3 12 2c1 2 2 3 2 5 0 1.5-.5 3-1 4 2.5 2.5 4 5 4 7 0 4.5-3.5 5-5 5z"/>
                        </svg>
                        {habit.currentStreak}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Journal Section */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Journal</h2>

            {/* Quick add */}
            <div className="mb-4">
              <textarea
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="How's your day going? Write a quick journal entry..."
                className="w-full h-24 px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[var(--text-tertiary)] mr-2">Mood:</span>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setJournalMood(journalMood === level ? null : level)}
                      className={`text-lg hover:scale-110 transition-transform ${
                        journalMood === level ? 'scale-110' : 'opacity-40 hover:opacity-70'
                      }`}
                    >
                      {MOOD_EMOJIS[level]}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleJournalSubmit}
                  disabled={!journalContent.trim() || journalSaving}
                  className="px-4 py-1.5 bg-[var(--primary)] text-white text-sm rounded-lg font-medium hover:bg-[var(--primary-hover)] transition disabled:opacity-50"
                >
                  {journalSaving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </div>

            {/* Recent entries */}
            {data.recentJournalEntries.length > 0 && (
              <div className="border-t border-[var(--border)] pt-4">
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Recent Entries</h3>
                <div className="space-y-3">
                  {data.recentJournalEntries.map((entry) => (
                    <div key={entry.id} className="p-3 bg-[var(--subtle-bg)] rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[var(--text-tertiary)]">
                          {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        {entry.mood && <span className="text-sm">{MOOD_EMOJIS[entry.mood]}</span>}
                      </div>
                      {entry.title && (
                        <p className="text-sm font-medium text-[var(--text-primary)]">{entry.title}</p>
                      )}
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{entry.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============ RIGHT COLUMN (1/3) ============ */}
        <div className="space-y-6">

          {/* Reminders */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Reminders</h3>
              {isPremium ? (
                <button
                  onClick={handleGenerateSmartReminders}
                  disabled={aiRemindersLoading}
                  className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-2 py-1 rounded-lg hover:bg-[var(--primary)] hover:text-white transition flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {aiRemindersLoading ? 'Generating...' : 'AI Reminders'}
                </button>
              ) : (
                <Link href="/pricing" className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 hover:text-[var(--primary)]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Upgrade
                </Link>
              )}
            </div>

            {data.reminders.length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] text-center py-4">All caught up!</p>
            ) : (
              <div className="space-y-3">
                {data.reminders.slice(0, 6).map((r) => (
                  <div key={r.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                      r.urgency === 'high' ? 'bg-[var(--destructive)]' :
                      r.urgency === 'medium' ? 'bg-[var(--streak)]' :
                      'bg-[var(--finance)]'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)]">{r.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{r.message}</p>
                    </div>
                    {r.type === 'ai' && (
                      <span className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-1.5 py-0.5 rounded">AI</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* To-Do List */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">To-Do</h3>
              <div className="flex items-center gap-2">
                {isPremium && (
                  <button
                    onClick={handleGenerateAiTodos}
                    disabled={aiTodosLoading}
                    className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-2 py-1 rounded-lg hover:bg-[var(--primary)] hover:text-white transition flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {aiTodosLoading ? 'Generating...' : 'AI Generate'}
                  </button>
                )}
                <button
                  onClick={() => setShowAddTodo(!showAddTodo)}
                  className="w-6 h-6 rounded-lg bg-[var(--subtle-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {!isPremium && (
              <Link href="/pricing" className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] mb-3 hover:text-[var(--primary)]">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Upgrade for AI-generated tasks
              </Link>
            )}

            {/* Add todo inline */}
            {showAddTodo && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                  placeholder="New task..."
                  className="flex-1 h-8 px-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  autoFocus
                />
                <button
                  onClick={handleAddTodo}
                  className="px-3 h-8 bg-[var(--primary)] text-white text-sm rounded-lg font-medium hover:bg-[var(--primary-hover)] transition"
                >
                  Add
                </button>
              </div>
            )}

            {data.todoItems.length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] text-center py-4">No tasks yet</p>
            ) : (
              <div className="space-y-2">
                {data.todoItems.map((todo) => (
                  <div key={todo.id} className="flex items-start gap-3 group">
                    <button
                      onClick={() => handleTodoToggle(todo.id)}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[var(--border)] flex items-center justify-center hover:border-[var(--primary)] transition flex-shrink-0"
                    >
                      <span className="hidden group-hover:block text-[var(--primary)] text-xs">&#10003;</span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)]">{todo.title}</p>
                      {todo.description && (
                        <p className="text-xs text-[var(--text-tertiary)] truncate">{todo.description}</p>
                      )}
                    </div>
                    {todo.source === 'AI_GENERATED' && (
                      <span className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-1.5 py-0.5 rounded flex-shrink-0">AI</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Streak Highlight */}
          {data.currentStreakHighlight && (
            <div className="bg-[var(--streak-light)] border border-[var(--streak)]/20 rounded-xl p-6">
              <div className="text-3xl mb-2">
                <svg className="w-8 h-8 text-[var(--streak)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 23c-3.5 0-7-2.5-7-7 0-3 2-5.5 4-7.5 1-1 1.5-2.5 1.5-4C10.5 4 11 3 12 2c1 2 2 3 2 5 0 1.5-.5 3-1 4 2.5 2.5 4 5 4 7 0 4.5-3.5 5-5 5z"/>
                </svg>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{data.currentStreakHighlight.streakDays} days</p>
              <p className="text-sm text-[var(--text-secondary)]">{data.currentStreakHighlight.habitTitle} streak</p>
            </div>
          )}

          {/* Weekly Summary */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">This Week</h3>
            <div className="flex justify-between items-end h-20 mb-3">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-6 bg-[var(--subtle-bg)] rounded overflow-hidden relative" style={{ height: 48 }}>
                    <div
                      className="w-full bg-[var(--primary)] rounded absolute bottom-0 transition-all"
                      style={{ height: `${(data.weeklySummary.completionRates[i] || 0) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)]">{day}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-[var(--text-secondary)]">
              {Math.round(data.weeklySummary.averageConsistency * 100)}% consistency
            </p>
          </div>
        </div>
      </div>

      {/* Floating Entry Button */}
      <button
        onClick={() => setShowEntryModal(!showEntryModal)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--primary)] text-white rounded-full shadow-lg hover:bg-[var(--primary-hover)] transition-all hover:scale-105 flex items-center justify-center z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Entry Modal */}
      {showEntryModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowEntryModal(false)} />
          <div className="fixed bottom-24 right-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl p-4 w-56 z-50">
            <div className="space-y-2">
              <button
                onClick={() => { setShowEntryModal(false); document.querySelector<HTMLElement>('.habit-checkin-btn')?.click(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--subtle-bg)] transition text-left"
              >
                <div className="w-8 h-8 bg-[var(--primary-light)] rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Check in Habit</span>
              </button>
              <button
                onClick={() => {
                  setShowEntryModal(false);
                  document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--subtle-bg)] transition text-left"
              >
                <div className="w-8 h-8 bg-[var(--streak-light)] rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[var(--streak)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Journal Entry</span>
              </button>
              <Link
                href="/finance"
                onClick={() => setShowEntryModal(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--subtle-bg)] transition text-left"
              >
                <div className="w-8 h-8 bg-[var(--finance-light)] rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[var(--finance)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Log Contribution</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
