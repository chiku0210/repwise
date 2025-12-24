import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Repwise',
  description: 'Privacy policy for Repwise',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            ← Back to Home
          </a>
        </div>

        <h1 className="mb-8 text-4xl font-bold text-white">Privacy Policy</h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <p className="mb-4 text-sm text-gray-400">
              Last updated: December 24, 2025
            </p>
            <p>
              Repwise ("we", "our", or "us") is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, and safeguard your information when
              you use our workout tracking application.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Information We Collect</h2>
            <p className="mb-3">
              When you use Repwise, we collect the following types of information:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong className="text-white">Account Information:</strong> When you sign in
                with Google, we collect your email address, name, and profile picture to create
                and manage your account.
              </li>
              <li>
                <strong className="text-white">Workout Data:</strong> Information about your
                workouts, exercises, sets, reps, and weights that you log in the app.
              </li>
              <li>
                <strong className="text-white">Usage Information:</strong> Data about how you
                interact with our app to improve functionality and user experience.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">How We Use Your Information</h2>
            <p className="mb-3">We use the collected information to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Provide and maintain our workout tracking service</li>
              <li>Authenticate your account and manage user sessions</li>
              <li>Store and display your workout history and progress</li>
              <li>Improve our app features and user experience</li>
              <li>Send important updates about the service (if applicable)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase, a trusted cloud database provider.
              We implement industry-standard security measures to protect your personal
              information from unauthorized access, alteration, or destruction. Your workout
              data is encrypted in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong className="text-white">Google OAuth:</strong> For secure authentication.
                By signing in with Google, you agree to Google's Privacy Policy and Terms of
                Service.
              </li>
              <li>
                <strong className="text-white">Supabase:</strong> For secure data storage and
                authentication. Supabase complies with GDPR and other privacy regulations.
              </li>
              <li>
                <strong className="text-white">Vercel:</strong> For hosting our application.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. Your
              workout data is private and only accessible to you. We may share anonymized,
              aggregated data for analytics purposes, but this data cannot be used to identify
              individual users.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Access your personal data stored in our system</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and all associated data</li>
              <li>Export your workout data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Data Retention</h2>
            <p>
              We retain your personal information and workout data for as long as your account
              is active. If you delete your account, we will permanently delete all your
              personal data within 30 days, except where we are required to retain it by law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Children's Privacy</h2>
            <p>
              Repwise is not intended for users under the age of 13. We do not knowingly
              collect personal information from children under 13. If you believe we have
              collected such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any
              significant changes by posting the new Privacy Policy on this page and updating
              the "Last updated" date above.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data,
              please contact us at:
            </p>
            <p className="mt-3">
              <strong className="text-white">Email:</strong>{' '}
              <a href="mailto:chiku0210@gmail.com" className="text-blue-400 hover:text-blue-300">
                chiku0210@gmail.com
              </a>
            </p>
            <p className="mt-2">
              <strong className="text-white">Website:</strong>{' '}
              <a href="https://repwise.in" className="text-blue-400 hover:text-blue-300">
                https://repwise.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
