import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Eiko Habits',
  description: 'Learn how Eiko Habits collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Eiko Habits ("we," "our," or "us"). We are committed to protecting your privacy and personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile
              application and website (collectively, the "Service").
            </p>
            <p className="text-gray-700">
              By using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
              <li><strong>Profile Information:</strong> Optional profile details you choose to provide</li>
              <li><strong>Habit Data:</strong> Habits, goals, check-ins, notes, and progress you create and track</li>
              <li><strong>Financial Information:</strong> Budget goals and financial tracking data you enter</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (web) and RevenueCat (mobile); we do not store credit card details</li>
              <li><strong>Communications:</strong> Messages you send to us for support or feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers</li>
              <li><strong>Usage Data:</strong> App features used, time spent, interaction patterns</li>
              <li><strong>Log Data:</strong> IP address, browser type, access times, pages viewed</li>
              <li><strong>Location Data:</strong> Approximate location (if you grant permission)</li>
              <li><strong>Analytics Data:</strong> App performance, crash reports, error logs</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Information from Third Parties</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>OAuth Providers:</strong> If you sign in with Google or Apple, we receive your name and email</li>
              <li><strong>Payment Processors:</strong> Transaction status and subscription information from Stripe/RevenueCat</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide, operate, and maintain the Service</li>
              <li>Process your habit tracking and goal management</li>
              <li>Manage your account and subscription</li>
              <li>Send you notifications, reminders, and updates</li>
              <li>Provide AI-powered insights and coaching (Premium feature)</li>
              <li>Process payments and prevent fraud</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Analyze usage patterns to improve the Service</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Detect, prevent, and address technical issues or security threats</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-3">We do not sell your personal information. We may share your information with:</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Service Providers</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Cloud Hosting:</strong> AWS, Vercel, or similar providers</li>
              <li><strong>Payment Processing:</strong> Stripe (web), RevenueCat (mobile)</li>
              <li><strong>AI Services:</strong> Anthropic Claude, OpenAI (for Premium AI features)</li>
              <li><strong>Analytics:</strong> PostHog, Google Analytics (anonymized data)</li>
              <li><strong>Email Services:</strong> For transactional and marketing emails</li>
              <li><strong>Push Notifications:</strong> Expo Push Notification Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Legal Requirements</h3>
            <p className="text-gray-700 mb-3">We may disclose your information if required to do so by law or in response to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Valid legal process (subpoena, court order)</li>
              <li>Requests from government authorities</li>
              <li>Protection of our rights, privacy, safety, or property</li>
              <li>Investigation of fraud or security issues</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Business Transfers</h3>
            <p className="text-gray-700">
              If we are involved in a merger, acquisition, or sale of assets, your information may be transferred.
              We will notify you before your information becomes subject to a different privacy policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-3">We implement industry-standard security measures:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Encryption in transit (TLS/SSL) and at rest</li>
              <li>Secure password hashing with bcrypt</li>
              <li>SHA-256 hashed refresh tokens with rotation</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure key storage (Expo SecureStore on mobile)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your data,
              we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700">
              We retain your information for as long as your account is active or as needed to provide the Service.
              You can request deletion of your account at any time through the app settings. After deletion:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>Your personal information will be deleted within 30 days</li>
              <li>Aggregated, anonymized data may be retained for analytics</li>
              <li>Some data may be retained longer if required by law or for legitimate business purposes</li>
              <li>Backup copies may persist for up to 90 days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights and Choices</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Access and Portability</h3>
            <p className="text-gray-700 mb-3">
              You can access and export your data at any time through the app settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Correction and Deletion</h3>
            <p className="text-gray-700 mb-3">
              You can update your profile information or delete your account in the app settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Marketing Communications</h3>
            <p className="text-gray-700 mb-3">
              You can opt out of marketing emails by clicking "unsubscribe" or adjusting notification settings in the app.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.4 Tracking and Analytics</h3>
            <p className="text-gray-700 mb-3">
              You can opt out of tracking through the iOS App Tracking Transparency prompt or device settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.5 Regional Rights</h3>
            <p className="text-gray-700 mb-3">Depending on your location, you may have additional rights:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>GDPR (EU):</strong> Right to access, rectification, erasure, restriction, portability, and objection</li>
              <li><strong>CCPA (California):</strong> Right to know, delete, opt-out of sale (we don't sell data)</li>
              <li><strong>Other Regions:</strong> Contact us to exercise your rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700">
              Our Service is not directed to children under 13 (or 16 in the EU). We do not knowingly collect personal
              information from children. If you believe we have collected information from a child, please contact us
              immediately and we will delete it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate
              safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending you an email notification (for material changes)</li>
              <li>In-app notification</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 mb-3">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> privacy@eikohabits.com</p>
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

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. App Store Privacy Details</h2>
            <p className="text-gray-700 mb-3">For transparency, here's what we report to app stores:</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Linked to You:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Contact Information (email)</li>
              <li>User Content (habits, goals, check-ins)</li>
              <li>Identifiers (user ID, device ID)</li>
              <li>Purchase History (subscription status)</li>
              <li>Usage Data (app interaction)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Used to Track You:</h3>
            <p className="text-gray-700 mb-3">
              We use the App Tracking Transparency framework for analytics. You can opt out at any time.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Not Collected:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Precise location</li>
              <li>Health and fitness data</li>
              <li>Contacts or photos (unless you explicitly share)</li>
              <li>Browsing history</li>
              <li>Search history</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
