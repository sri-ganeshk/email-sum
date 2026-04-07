import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 2025</p>

        <p className="text-gray-700 mb-6">
          This Privacy Policy explains how our application (<strong>Smart Email Assistant</strong>) collects, uses,
          and protects user data.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Access</h2>
          <p className="text-gray-700 mb-2">With your consent, we may access:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Your email content (via Gmail API)</li>
            <li>Your calendar data (via Google Calendar API)</li>
            <li>Basic profile information (name, email address)</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Information</h2>
          <p className="text-gray-700 mb-2">We use this data only to:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Extract important information from emails (e.g., events, reminders)</li>
            <li>Help users create and manage calendar events</li>
            <li>Improve productivity by summarizing email content</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Protection</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>We do not sell, share, or transfer your data to third parties</li>
            <li>Data is processed securely and only for intended functionality</li>
            <li>We use industry-standard security practices to protect user data</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Limited Use Compliance</h2>
          <p className="text-gray-700 mb-2">
            Our application complies with the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements. We only use data to provide user-facing features.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
          <p className="text-gray-700">
            We do not store user data permanently. Data is processed temporarily and discarded after use
            unless explicitly required by the user.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. User Control</h2>
          <p className="text-gray-700">
            Users can revoke access at any time through their{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Account settings
            </a>
            .
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:ganeshknsml@gmail.com" className="text-blue-600 hover:underline">
              ganeshknsml@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
