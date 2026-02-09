'use client';

const features = [
  {
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    title: 'Personalized habit routines',
    description: 'AI-crafted daily routines tailored to your schedule and goals.',
  },
  {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Financial action plans',
    description: 'Step-by-step strategies to hit your savings and debt goals faster.',
  },
  {
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Weekly progress reviews',
    description: 'Comprehensive insights on what worked and what to adjust.',
  },
  {
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    title: 'Smart check-in notifications',
    description: 'Timely nudges based on your patterns and habit completion.',
  },
];

const mockChatMessages = [
  { role: 'assistant', text: 'Good morning! You completed 3 out of 4 habits yesterday. Great consistency!' },
  { role: 'user', text: 'Thanks! I missed my reading habit. Any tips?' },
  { role: 'assistant', text: 'Try pairing reading with your morning coffee. Stack it with a habit you already do consistently.' },
  { role: 'user', text: 'That\'s a great idea. What about my savings goal?' },
  { role: 'assistant', text: 'You\'re 43% toward your emergency fund. At your current rate, you\'ll hit $5,000 by August.' },
];

export default function CoachPage() {
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">AI Coach</h1>
      </div>

      {/* Container with blurred chat preview behind */}
      <div className="relative">
        {/* Blurred Chat Preview */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 select-none" aria-hidden="true">
          <div className="space-y-4 blur-[6px] pointer-events-none">
            {mockChatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--subtle-bg)] text-[var(--text-primary)]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Fake input area */}
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
              <div className="flex-1 h-10 bg-[var(--subtle-bg)] rounded-lg" />
              <div className="w-10 h-10 bg-[var(--primary)] rounded-lg" />
            </div>
          </div>
        </div>

        {/* Upsell Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            {/* Icon */}
            <div className="w-14 h-14 bg-[var(--primary-light)] rounded-2xl flex items-center justify-center mb-5 mx-auto">
              <svg className="w-7 h-7 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-2">
              Unlock your AI Coach
            </h2>
            <p className="text-[var(--text-tertiary)] text-center mb-6">
              Get a personal AI-powered coach that helps you build better habits, manage finances, and reach your goals faster.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[var(--primary-light)] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4.5 h-4.5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{feature.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-[var(--subtle-bg)] rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Monthly</p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">$19.99<span className="text-sm font-normal text-[var(--text-tertiary)]">/month</span></p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Yearly</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--finance-light)] text-[var(--finance)]">Save 58%</span>
                  </div>
                  <p className="text-xl font-bold text-[var(--text-primary)]">$99.99<span className="text-sm font-normal text-[var(--text-tertiary)]">/year</span></p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3 rounded-xl text-sm font-semibold transition-colors">
              Start 7-Day Free Trial
            </button>
            <p className="text-xs text-[var(--text-tertiary)] text-center mt-3">
              Cancel anytime. No charge during the trial period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
