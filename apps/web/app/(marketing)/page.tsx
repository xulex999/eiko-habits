import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">Eiko Habits</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[var(--primary-hover)] transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] leading-tight">
          Build habits that
          <br />
          <span className="text-[var(--primary)]">actually stick</span>
        </h1>
        <p className="mt-6 text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Track habits, manage finances, and reach your goals with AI-powered coaching.
          One app for your entire self-improvement journey.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-[var(--primary)] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[var(--primary-hover)] transition"
          >
            Start Free
          </Link>
          <Link
            href="/pricing"
            className="border border-[var(--border)] text-[var(--text-primary)] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[var(--subtle-bg)] transition"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-16">
          Everything you need to level up
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎯',
              title: 'Habit Tracking',
              desc: 'Daily check-ins, streak tracking, and consistency scores. Build momentum that lasts.',
            },
            {
              icon: '💰',
              title: 'Finance Goals',
              desc: 'Track savings, debt payoff, and budgets. See forecasted completion dates in real time.',
            },
            {
              icon: '🤖',
              title: 'AI Coach',
              desc: 'Get personalized routines, financial plans, and weekly reviews from Eiko AI.',
            },
            {
              icon: '📊',
              title: 'Progress Dashboard',
              desc: "See today's priorities, streak highlights, and weekly summaries at a glance.",
            },
            {
              icon: '🔔',
              title: 'Smart Notifications',
              desc: 'AI-powered check-in reminders that know your schedule and what matters most.',
            },
            {
              icon: '📱',
              title: 'Cross-Platform',
              desc: 'Available on iOS, Android, and the web. Your data syncs everywhere.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {feature.title}
              </h3>
              <p className="text-[var(--text-secondary)]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          Ready to build better habits?
        </h2>
        <p className="text-lg text-[var(--text-secondary)] mb-8">
          Start free. Upgrade to Premium for AI coaching at $19.99/month or $99.99/year.
        </p>
        <Link
          href="/register"
          className="inline-block bg-[var(--primary)] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[var(--primary-hover)] transition"
        >
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <p className="text-[var(--text-tertiary)] text-sm">
            &copy; {new Date().getFullYear()} Eiko Habits. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[var(--text-tertiary)]">
            <a href="#" className="hover:text-[var(--text-primary)]">Privacy</a>
            <a href="#" className="hover:text-[var(--text-primary)]">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
