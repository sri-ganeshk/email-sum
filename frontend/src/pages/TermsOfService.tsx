import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 2025</p>

        <p className="text-gray-700 mb-6">
          By using <strong>Smart Email Assistant</strong> ("the App"), you agree to the following terms. Please
          read them carefully.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Use at Your Own Risk</h2>
          <p className="text-gray-700">
            This is a demo project provided as-is. We make no warranties, express or implied, about the
            reliability, accuracy, or availability of the App. Use it at your own risk.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Permitted Use</h2>
          <p className="text-gray-700 mb-2">You may use the App to:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Summarize your own Gmail emails</li>
            <li>Extract events and reminders from your emails</li>
            <li>Create Google Calendar events on your behalf</li>
          </ul>
          <p className="text-gray-700 mt-2">
            You may not use the App for any unlawful purpose or in a way that violates Google's Terms of
            Service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Google Account Access</h2>
          <p className="text-gray-700">
            The App requests access to your Gmail and Google Calendar through Google OAuth. You can revoke
            this access at any time via your{" "}
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
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Limitation of Liability</h2>
          <p className="text-gray-700">
            To the fullest extent permitted by law, we are not liable for any direct, indirect, incidental,
            or consequential damages arising from your use of the App, including but not limited to loss of
            data or missed calendar events.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Changes to These Terms</h2>
          <p className="text-gray-700">
            We may update these Terms of Service from time to time. Continued use of the App after changes
            are posted constitutes your acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact</h2>
          <p className="text-gray-700">
            For questions about these Terms, contact us at{" "}
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
