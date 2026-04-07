import { useEmailStore } from "../../store/emailStore";
import { useAIProcess, useAIResult } from "../../api/queries/useAIProcess";
import { AIPanelSkeleton } from "../common/Skeleton";
import SummaryCard from "./SummaryCard";
import EventCard from "./EventCard";

export default function AIPanel() {
  const selectedEmailId = useEmailStore((s) => s.selectedEmailId);
  const { mutate: processEmail, isPending } = useAIProcess();
  const aiResult = useAIResult(selectedEmailId);

  if (!selectedEmailId) return null;

  return (
    <div className="w-80 flex-shrink-0 border-l border-gray-200 bg-gray-50 flex flex-col h-full animate-slide-in">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-800">AI Analysis</span>
        </div>

        {!aiResult && (
          <button
            onClick={() => processEmail(selectedEmailId)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs
                       rounded-lg hover:bg-purple-700 disabled:opacity-60 transition-colors"
          >
            {isPending ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            {isPending ? "Analyzing…" : "Analyze"}
          </button>
        )}

        {aiResult && (
          <button
            onClick={() => processEmail(selectedEmailId)}
            disabled={isPending}
            className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
            title="Re-analyze"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isPending ? (
          <AIPanelSkeleton />
        ) : aiResult ? (
          <>
            <SummaryCard summary={aiResult.summary} />

            {aiResult.events.length > 0 ? (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Detected Events ({aiResult.events.length})
                </p>
                <div className="space-y-2">
                  {aiResult.events.map((event, i) => (
                    <EventCard key={i} event={event} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">No calendar events detected.</p>
              </div>
            )}

            <p className="text-xs text-gray-300 text-right">
              Processed in {aiResult.processingTimeMs}ms
            </p>
          </>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-sm">Click Analyze to summarize this email and extract events.</p>
          </div>
        )}
      </div>
    </div>
  );
}
