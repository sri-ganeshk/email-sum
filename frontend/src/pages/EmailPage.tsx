import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEmailDetail } from "../api/queries/useEmailDetail";
import { useAIProcess } from "../api/queries/useAIProcess";
import { useQueryClient } from "@tanstack/react-query";
import { AIResult } from "../types/ai";
import SummaryCard from "../components/ai/SummaryCard";
import EventCard from "../components/ai/EventCard";
import { AIPanelSkeleton } from "../components/common/Skeleton";

function formatFullDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString([], {
      weekday: "long", year: "numeric", month: "long",
      day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return dateStr; }
}

/** Render plain-text email body: convert URLs to clickable links, preserve line breaks */
function renderEmailBody(body: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const lines = body.split("\n");

  return lines.map((line, li) => {
    const parts = line.split(urlRegex);
    return (
      <span key={li}>
        {parts.map((part, pi) =>
          urlRegex.test(part) ? (
            <a
              key={pi}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all text-xs"
              title={part}
            >
              {new URL(part).hostname}
            </a>
          ) : (
            <span key={pi}>{part}</span>
          )
        )}
        {li < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function EmailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: emailData, isLoading: emailLoading, isError: emailError } = useEmailDetail(id ?? null);
  const { mutate: processEmail, isPending: aiLoading } = useAIProcess();
  const aiResult = queryClient.getQueryData<AIResult>(["ai", id]);

  // Auto-trigger AI as soon as email body is available
  useEffect(() => {
    if (emailData?.email && !aiResult && !aiLoading) {
      processEmail(emailData.email.id);
    }
  }, [emailData?.email?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const email = emailData?.email;

  return (
    // Full-screen fixed layout — each panel scrolls independently
    <div className="h-screen flex flex-col overflow-hidden bg-white">

      {/* ── Sticky top bar ── */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Inbox
        </button>

        <div className="h-4 w-px bg-gray-200 flex-shrink-0" />

        {emailLoading
          ? <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
          : <h1 className="text-sm font-semibold text-gray-800 truncate flex-1 min-w-0">{email?.subject}</h1>
        }

        {aiResult && (
          <button
            onClick={() => id && processEmail(id)}
            disabled={aiLoading}
            title="Re-analyze"
            className="flex-shrink-0 text-gray-400 hover:text-purple-600 disabled:opacity-40 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </header>

      {emailError ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Failed to load email. Please go back and try again.
        </div>
      ) : (
        // Two-panel row — each panel scrolls on its own
        <div className="flex-1 flex overflow-hidden">

          {/* ── Left: Email ── */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100 min-w-0">

            {/* Email meta — fixed within left panel */}
            <div className="flex-shrink-0 px-8 pt-7 pb-5 border-b border-gray-100">
              {emailLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mt-3" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              ) : email ? (
                <>
                  <h2 className="text-lg font-bold text-gray-900 leading-snug mb-4">{email.subject}</h2>
                  <div className="grid grid-cols-[48px_1fr] gap-x-2 gap-y-1 text-sm">
                    <span className="text-gray-400 text-right">From</span>
                    <span className="text-gray-700 truncate">{email.from}</span>
                    <span className="text-gray-400 text-right">To</span>
                    <span className="text-gray-700 truncate">{email.to}</span>
                    {email.cc && <>
                      <span className="text-gray-400 text-right">Cc</span>
                      <span className="text-gray-700 truncate">{email.cc}</span>
                    </>}
                    <span className="text-gray-400 text-right">Date</span>
                    <span className="text-gray-500 text-xs leading-5">{formatFullDate(email.date)}</span>
                  </div>
                </>
              ) : null}
            </div>

            {/* Email body — scrolls independently */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {emailLoading ? (
                <div className="space-y-2 animate-pulse">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-3 bg-gray-100 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
                  ))}
                </div>
              ) : email ? (
                <p className="text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
                  {renderEmailBody(email.body)}
                </p>
              ) : null}
            </div>
          </div>

          {/* ── Right: AI Panel — scrolls independently ── */}
          <div className="w-96 flex-shrink-0 flex flex-col overflow-hidden bg-gray-50">

            {/* AI panel header — fixed */}
            <div className="flex-shrink-0 px-5 py-4 bg-white border-b border-gray-200 flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-800">AI Analysis</span>
              {aiLoading && (
                <span className="ml-auto flex items-center gap-1.5 text-xs text-purple-500">
                  <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  Analyzing…
                </span>
              )}
            </div>

            {/* AI results — scrolls independently */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {aiLoading && !aiResult ? (
                <AIPanelSkeleton />
              ) : aiResult ? (
                <>
                  <SummaryCard summary={aiResult.summary} />

                  {aiResult.events.length > 0 ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Detected Events ({aiResult.events.length})
                      </p>
                      <div className="space-y-2">
                        {aiResult.events.map((event, i) => (
                          <EventCard key={i} event={event} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      No calendar events detected.
                    </div>
                  )}

                  <p className="text-xs text-gray-300 text-right pt-2">
                    Processed in {aiResult.processingTimeMs}ms
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <div className="w-8 h-8 border-2 border-purple-300 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm">Starting AI analysis…</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
