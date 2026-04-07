import { useEmailStore } from "../../store/emailStore";
import { useEmailDetail } from "../../api/queries/useEmailDetail";
import { useUIStore } from "../../store/uiStore";
import AIPanel from "../ai/AIPanel";

function formatFullDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString([], {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function EmailDetail() {
  const selectedEmailId = useEmailStore((s) => s.selectedEmailId);
  const { aiPanelOpen, toggleAIPanel } = useUIStore();
  const { data, isLoading, isError } = useEmailDetail(selectedEmailId);

  const email = data?.email;

  if (!selectedEmailId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-gray-400">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Select an email to read</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-w-0 h-full">
      {/* Email body */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500 p-8 text-center">
            Failed to load email. Please try again.
          </div>
        ) : email ? (
          <>
            {/* Email header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900 leading-snug">{email.subject}</h2>
                <button
                  onClick={toggleAIPanel}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                    transition-colors flex-shrink-0
                    ${aiPanelOpen
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI
                </button>
              </div>

              <div className="mt-2 space-y-0.5 text-sm text-gray-500">
                <p><span className="text-gray-400">From:</span> {email.from}</p>
                <p><span className="text-gray-400">To:</span> {email.to}</p>
                {email.cc && <p><span className="text-gray-400">Cc:</span> {email.cc}</p>}
                <p className="text-xs text-gray-400">{formatFullDate(email.date)}</p>
              </div>
            </div>

            {/* Email body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {email.body}
              </pre>
            </div>
          </>
        ) : null}
      </div>

      {/* AI Panel (slide in from right) */}
      {aiPanelOpen && <AIPanel />}
    </div>
  );
}
