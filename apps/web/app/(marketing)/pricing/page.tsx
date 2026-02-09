import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">Eiko Habits</span>
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-center text-lg text-[var(--text-secondary)] mb-16">
          Start free, upgrade when you're ready for AI coaching.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Free</h2>
            <p className="text-[var(--text-tertiary)] mt-2">Everything you need to get started</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-[var(--text-primary)]">$0</span>
              <span className="text-[var(--text-tertiary)]"> / forever</span>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                'Up to 3 active goals',
                'Up to 5 active habits',
                'Daily check-ins & streaks',
                'Basic finance tracking',
                'Progress dashboard',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[var(--text-primary)]">
                  <svg className="w-5 h-5 text-[var(--finance)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 block text-center py-3 px-6 border border-[var(--border)] rounded-lg font-semibold text-[var(--text-primary)] hover:bg-[var(--subtle-bg)] transition"
            >
              Get Started
            </Link>
          </div>

          {/* Premium */}
          <div className="bg-[var(--surface)] border-2 border-[var(--primary)] rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Premium</h2>
            <p className="text-[var(--text-tertiary)] mt-2">AI-powered coaching & unlimited tracking</p>

            <div className="mt-6 space-y-2">
              <div>
                <span className="text-4xl font-bold text-[var(--text-primary)]">$19.99</span>
                <span className="text-[var(--text-tertiary)]"> / month</span>
              </div>
              <div className="text-sm">
                <span className="text-[var(--text-secondary)]">or </span>
                <span className="font-semibold text-[var(--text-primary)]">$99.99/year</span>
                <span className="ml-2 bg-[var(--finance-light)] text-[var(--finance)] px-2 py-0.5 rounded text-xs font-semibold">
                  Save 58%
                </span>
              </div>
            </div>

            <ul className="mt-8 space-y-3">
              {[
                'Unlimited goals & habits',
                'AI Coach — personalized routines',
                'AI financial action plans',
                'Weekly AI progress reviews',
                'AI check-in notifications',
                'Advanced analytics & forecasts',
                'Priority support',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[var(--text-primary)]">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 block text-center py-3 px-6 bg-[var(--primary)] text-white rounded-lg font-semibold hover:bg-[var(--primary-hover)] transition"
            >
              Start 7-Day Free Trial
            </Link>
            <p className="text-center text-xs text-[var(--text-tertiary)] mt-3">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
