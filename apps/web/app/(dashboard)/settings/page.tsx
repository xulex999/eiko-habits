'use client';

import { useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface NotificationSettings {
  habitReminders: boolean;
  streakAlerts: boolean;
  weeklyReviews: boolean;
  aiInsights: boolean;
}

export default function SettingsPage() {
  const [name, setName] = useState('User');
  const [email, setEmail] = useState('user@example.com');
  const [theme, setTheme] = useState<Theme>('system');
  const [notifications, setNotifications] = useState<NotificationSettings>({
    habitReminders: true,
    streakAlerts: true,
    weeklyReviews: false,
    aiInsights: false,
  });

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationOptions: { key: keyof NotificationSettings; label: string; description: string }[] = [
    { key: 'habitReminders', label: 'Habit Reminders', description: 'Get notified when it\'s time to complete your habits.' },
    { key: 'streakAlerts', label: 'Streak Alerts', description: 'Receive warnings when a streak is about to break.' },
    { key: 'weeklyReviews', label: 'Weekly Reviews', description: 'Get a weekly summary of your progress.' },
    { key: 'aiInsights', label: 'AI Insights', description: 'Receive personalized tips from your AI Coach.' },
  ];

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
    { value: 'dark', label: 'Dark', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
    { value: 'system', label: 'System', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition"
              />
            </div>
            <div className="pt-2">
              <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Subscription</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-[var(--subtle-bg)] text-[var(--text-secondary)]">
                Free Plan
              </span>
              <p className="text-sm text-[var(--text-tertiary)]">Basic features with limited AI coach access.</p>
            </div>
            <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-shrink-0">
              Upgrade to Premium
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Notifications</h2>
          <div className="space-y-4">
            {notificationOptions.map((option) => (
              <div key={option.key} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{option.label}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{option.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(option.key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                    notifications[option.key] ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                  }`}
                  role="switch"
                  aria-checked={notifications[option.key]}
                  aria-label={`Toggle ${option.label}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition ${
                      notifications[option.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Appearance</h2>
          <div className="flex gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  theme === option.value
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                    : 'border-[var(--border)] hover:border-[var(--text-tertiary)]'
                }`}
              >
                <svg
                  className={`w-6 h-6 ${theme === option.value ? 'text-[var(--primary)]' : 'text-[var(--text-tertiary)]'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={option.icon} />
                </svg>
                <span className={`text-sm font-medium ${theme === option.value ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Data Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Data</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Export Data</p>
                <p className="text-xs text-[var(--text-tertiary)]">Download all your habits, goals, and finance data as JSON.</p>
              </div>
              <button className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--subtle-bg)] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            </div>
            <div className="border-t border-[var(--border)] pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--destructive)]">Delete Account</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Permanently remove your account and all associated data.</p>
                </div>
                <button className="px-4 py-2 bg-[var(--destructive-light)] border border-[var(--destructive)]/20 rounded-lg text-sm font-semibold text-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-white transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
