import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support - Eiko Habits',
  description: 'Get help with Eiko Habits. FAQs, contact information, and resources.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
        <p className="text-xl text-gray-600 mb-12">
          We're here to help! Find answers to common questions or reach out to our team.
        </p>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I create a habit?</h3>
              <p className="text-gray-700">
                Tap the "+" button on the Habits screen, enter your habit name, set your schedule (daily, weekly, or custom),
                and configure reminders. You can also add notes and tags to organize your habits.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What's included in the Premium plan?</h3>
              <p className="text-gray-700">
                Premium includes unlimited goals and habits, AI-powered coaching and insights, advanced analytics,
                priority support, and custom notifications. Free plan includes up to 3 goals and 5 habits.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I cancel my subscription?</h3>
              <p className="text-gray-700 mb-2">
                <strong>Web:</strong> Go to Settings → Subscription → Cancel Subscription
              </p>
              <p className="text-gray-700 mb-2">
                <strong>iOS:</strong> Settings → [Your Name] → Subscriptions → Eiko Habits → Cancel
              </p>
              <p className="text-gray-700">
                <strong>Android:</strong> Google Play → Subscriptions → Eiko Habits → Cancel
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I restore my purchases on a new device?</h3>
              <p className="text-gray-700">
                Yes! Sign in with the same account on your new device, and your subscription will automatically sync.
                On iOS, you can also tap "Restore Purchases" in Settings.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I delete my account?</h3>
              <p className="text-gray-700">
                Go to Settings → Account → Delete Account. This will permanently delete all your data within 30 days.
                Make sure to export your data first if you want to keep it.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do streaks work?</h3>
              <p className="text-gray-700">
                A streak is the number of consecutive days or periods you've completed a habit. Missing a check-in
                will reset your streak to zero. Enable notifications to get reminded before your streak expires!
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Does Eiko Habits work offline?</h3>
              <p className="text-gray-700">
                Yes! You can track habits offline. Your data will automatically sync when you reconnect to the internet.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I export my data?</h3>
              <p className="text-gray-700">
                Go to Settings → Data & Privacy → Export Data. You'll receive a JSON file with all your habits, goals,
                and check-ins that you can download or email to yourself.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-700">
                Yes! We use industry-standard encryption (TLS/SSL) for data transmission and encryption at rest for storage.
                Your passwords are hashed with bcrypt. See our <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a> for details.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use Eiko Habits on multiple devices?</h3>
              <p className="text-gray-700">
                Yes! Sign in with the same account on any device (iPhone, iPad, Android, or web) and your data will sync automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
          <p className="text-gray-700 mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📧 Email Support</h3>
              <p className="text-gray-700 mb-2">
                <strong>General Support:</strong><br />
                <a href="mailto:support@eikohabits.com" className="text-indigo-600 hover:underline">
                  support@eikohabits.com
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Billing:</strong><br />
                <a href="mailto:billing@eikohabits.com" className="text-indigo-600 hover:underline">
                  billing@eikohabits.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Response Time:</strong> Within 24 hours<br />
                <strong>Premium Users:</strong> Within 12 hours
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💬 In-App Support</h3>
              <p className="text-gray-700 mb-4">
                Get help directly in the app:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Open the Eiko Habits app</li>
                <li>Go to Settings</li>
                <li>Tap "Help & Support"</li>
                <li>Choose "Contact Support"</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/privacy"
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Policy</h3>
              <p className="text-gray-600 text-sm">Learn how we protect your data</p>
            </a>

            <a
              href="/terms"
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Terms of Service</h3>
              <p className="text-gray-600 text-sm">Read our terms and conditions</p>
            </a>

            <a
              href="/pricing"
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing</h3>
              <p className="text-gray-600 text-sm">View plans and pricing details</p>
            </a>
          </div>
        </section>

        {/* Technical Issues */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Troubleshooting</h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">⚠️ Common Issues</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">App not syncing?</h4>
                <p className="text-gray-700 text-sm">
                  Check your internet connection, then pull down to refresh. If that doesn't work, sign out and sign back in.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Notifications not working?</h4>
                <p className="text-gray-700 text-sm">
                  Make sure notifications are enabled in your device settings: Settings → Eiko Habits → Notifications → Allow.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-1">App crashes on startup?</h4>
                <p className="text-gray-700 text-sm">
                  Try force-closing the app and reopening it. If it persists, uninstall and reinstall the app (your data is backed up).
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Can't sign in?</h4>
                <p className="text-gray-700 text-sm">
                  Use "Forgot Password" to reset your password. If you signed up with Google/Apple, use that method to sign in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Requests */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Requests</h2>
          <div className="bg-indigo-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Have an idea for a new feature? We'd love to hear it!
            </p>
            <p className="text-gray-700">
              Email us at <a href="mailto:feedback@eikohabits.com" className="text-indigo-600 hover:underline font-semibold">feedback@eikohabits.com</a> with
              your suggestions. We review all feedback and prioritize features based on user demand.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
