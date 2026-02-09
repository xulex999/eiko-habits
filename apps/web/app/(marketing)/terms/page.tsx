import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Eiko Habits',
  description: 'Terms and conditions for using Eiko Habits app and services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Eiko Habits! These Terms of Service ("Terms") govern your access to and use of our mobile
              application, website, and services (collectively, the "Service"). By accessing or using the Service,
              you agree to be bound by these Terms.
            </p>
            <p className="text-gray-700">
              If you do not agree to these Terms, please do not use the Service. We reserve the right to modify these
              Terms at any time. Continued use after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Eiko Habits is a habit tracking and goal management application that helps users build better habits,
              achieve goals, and track their progress. The Service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Habit tracking and check-ins</li>
              <li>Goal setting and progress monitoring</li>
              <li>Financial goal tracking</li>
              <li>Streak and consistency metrics</li>
              <li>Push notifications and reminders</li>
              <li>Analytics and insights</li>
              <li>AI-powered coaching (Premium subscribers only)</li>
              <li>Cross-platform synchronization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Creation</h3>
            <p className="text-gray-700 mb-3">
              To use the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be at least 13 years old (or 16 in the EU)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Termination</h3>
            <p className="text-gray-700">
              You may delete your account at any time through the app settings. We reserve the right to suspend or
              terminate your account if you violate these Terms or engage in fraudulent or illegal activities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription Plans</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Free Plan</h3>
            <p className="text-gray-700 mb-3">The free plan includes:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Up to 3 goals</li>
              <li>Up to 5 habits</li>
              <li>Basic tracking and analytics</li>
              <li>Push notifications</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Premium Plan</h3>
            <p className="text-gray-700 mb-3">Premium subscription includes:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Unlimited goals and habits</li>
              <li>AI-powered habit coaching and insights</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
              <li>Custom notifications</li>
            </ul>
            <p className="text-gray-700 mb-3"><strong>Pricing:</strong></p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Monthly: $19.99/month</li>
              <li>Annual: $99.99/year (save 58%)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Billing</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Subscriptions are billed in advance on a recurring basis</li>
              <li>Payments are processed through Stripe (web) or App Store/RevenueCat (mobile)</li>
              <li>All fees are in U.S. Dollars unless otherwise stated</li>
              <li>Prices are subject to change with 30 days notice</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Auto-Renewal</h3>
            <p className="text-gray-700 mb-3">
              Your subscription will automatically renew at the end of each billing period unless you cancel before
              the renewal date. You can cancel anytime through:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Web:</strong> Account settings</li>
              <li><strong>iOS:</strong> App Store subscription settings</li>
              <li><strong>Android:</strong> Google Play subscription settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Refunds</h3>
            <p className="text-gray-700">
              Refunds are handled according to the platform's refund policy:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li><strong>Web (Stripe):</strong> Contact support within 7 days for refund consideration</li>
              <li><strong>iOS (App Store):</strong> Request refund through Apple</li>
              <li><strong>Android (Google Play):</strong> Request refund through Google</li>
            </ul>
            <p className="text-gray-700 mt-3">
              We do not provide refunds for partial billing periods. Cancellation takes effect at the end of the current billing cycle.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.4 Free Trials</h3>
            <p className="text-gray-700">
              We may offer free trials for Premium subscriptions. You will be charged when the trial ends unless you cancel
              before the trial period expires.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Acceptable Use</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 You Agree Not To:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code or viruses</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Scrape, crawl, or data mine the Service</li>
              <li>Reverse engineer or decompile the app</li>
              <li>Share your account with others</li>
              <li>Create fake accounts or impersonate others</li>
              <li>Spam, harass, or abuse other users or our support team</li>
              <li>Use the Service for commercial purposes without permission</li>
              <li>Resell or redistribute the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Our Rights</h3>
            <p className="text-gray-700 mb-3">
              The Service, including all content, features, functionality, software, and design, is owned by Eiko Habits
              and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify,
              distribute, sell, or lease any part of the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Your Rights</h3>
            <p className="text-gray-700 mb-3">
              You retain ownership of all content you create using the Service (habits, goals, notes, etc.). By using
              the Service, you grant us a limited license to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Store and process your content to provide the Service</li>
              <li>Create aggregated, anonymized analytics</li>
              <li>Use your feedback to improve the Service</li>
            </ul>
            <p className="text-gray-700 mt-3">
              We will not share your personal content publicly or with third parties except as described in our Privacy Policy.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Trademarks</h3>
            <p className="text-gray-700">
              "Eiko Habits" and our logo are trademarks of Eiko Habits. You may not use our trademarks without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. AI Features and Data Usage</h2>
            <p className="text-gray-700 mb-3">
              Premium subscribers have access to AI-powered coaching features powered by Anthropic Claude and OpenAI.
              When using AI features:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your habit data may be processed by third-party AI providers</li>
              <li>AI responses are generated automatically and may not always be accurate</li>
              <li>AI coaching is not a substitute for professional medical or therapeutic advice</li>
              <li>We do not guarantee the accuracy, completeness, or usefulness of AI-generated content</li>
              <li>You should not rely solely on AI advice for important decisions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers and Limitations</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 No Warranty</h3>
            <p className="text-gray-700 mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
              INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 Not Medical Advice</h3>
            <p className="text-gray-700 mb-4">
              The Service is not intended to provide medical, therapeutic, or professional advice. Always consult qualified
              professionals for health, financial, or other important decisions. Eiko Habits is a productivity tool, not a
              substitute for professional services.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">9.3 Service Availability</h3>
            <p className="text-gray-700 mb-4">
              We do not guarantee that the Service will be available at all times or error-free. We may modify, suspend,
              or discontinue any part of the Service at any time without notice.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">9.4 Limitation of Liability</h3>
            <p className="text-gray-700">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, EIKO HABITS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY
              OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to your data</li>
              <li>Any bugs, viruses, or malicious code in the Service</li>
              <li>Any errors or inaccuracies in the Service</li>
              <li>Any third-party services or content</li>
            </ul>
            <p className="text-gray-700 mt-3">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRIOR TO THE EVENT GIVING RISE TO LIABILITY.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify, defend, and hold harmless Eiko Habits and its officers, directors, employees, and agents
              from any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your content or conduct</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">11.1 Informal Resolution</h3>
            <p className="text-gray-700 mb-4">
              If you have a dispute with us, please contact us first at support@eikohabits.com to attempt informal resolution.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">11.2 Arbitration</h3>
            <p className="text-gray-700 mb-4">
              Any disputes that cannot be resolved informally shall be resolved through binding arbitration in accordance
              with the rules of the American Arbitration Association. The arbitration will be conducted in [Your State/Country].
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">11.3 Class Action Waiver</h3>
            <p className="text-gray-700">
              You agree that disputes will be resolved on an individual basis only, and not as part of a class action or
              consolidated proceeding.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of [Your State/Country],
              without regard to conflict of law principles. Any legal action must be brought in the courts located in
              [Your Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>Posting the updated Terms with a new "Last Updated" date</li>
              <li>Sending you an email notification</li>
              <li>Displaying an in-app notification</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Your continued use of the Service after changes take effect constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Termination</h2>
            <p className="text-gray-700 mb-3">
              We may suspend or terminate your access to the Service at any time, with or without notice, for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abusive behavior toward users or staff</li>
              <li>Extended inactivity</li>
              <li>Any other reason at our sole discretion</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Upon termination, your right to use the Service will immediately cease. Sections that should survive
              termination (including disclaimers, limitations of liability, and dispute resolution) will remain in effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Miscellaneous</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">15.1 Entire Agreement</h3>
            <p className="text-gray-700 mb-3">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Eiko Habits.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">15.2 Severability</h3>
            <p className="text-gray-700 mb-3">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">15.3 No Waiver</h3>
            <p className="text-gray-700 mb-3">
              Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">15.4 Assignment</h3>
            <p className="text-gray-700 mb-3">
              You may not assign or transfer these Terms without our prior written consent. We may assign these Terms
              without restriction.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">15.5 Force Majeure</h3>
            <p className="text-gray-700">
              We shall not be liable for any failure to perform due to circumstances beyond our reasonable control,
              including natural disasters, war, terrorism, riots, or failure of third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
            <p className="text-gray-700 mb-3">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> legal@eikohabits.com</p>
              <p className="text-gray-700"><strong>Support:</strong> support@eikohabits.com</p>
              <p className="text-gray-700"><strong>Website:</strong> https://eikohabits.com/support</p>
              <p className="text-gray-700 mt-4"><strong>Mailing Address:</strong></p>
              <p className="text-gray-700">
                Eiko Habits<br />
                [Your Address]<br />
                [City, State, ZIP]<br />
                [Country]
              </p>
            </div>
          </section>

          <div className="bg-indigo-50 p-6 rounded-lg mt-8">
            <p className="text-sm text-gray-600">
              By clicking "I Accept" during signup or by using the Service, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
