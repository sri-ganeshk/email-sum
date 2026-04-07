import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { useEmailStore } from "../../store/emailStore";
import { useEmails } from "../../api/queries/useEmails";
import { EmailRowSkeleton } from "../common/Skeleton";
import { EmailSummary } from "../../types/email";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function extractName(from: string): string {
  const match = from.match(/^"?([^"<]+)"?\s*</);
  return match ? match[1].trim() : from;
}

function EmailRow({ email, isSelected }: { email: EmailSummary; isSelected: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/email/${email.id}`)}
      className={`w-full flex items-start gap-3 px-4 py-3 border-b border-gray-100 text-left
        hover:bg-gray-50 transition-colors
        ${isSelected ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}
        ${!email.isRead ? "bg-white" : "bg-gray-50/50"}`}
    >
      {/* Unread indicator */}
      <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!email.isRead ? "bg-blue-500" : "bg-transparent"}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`text-sm truncate ${!email.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
            {extractName(email.from)}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(email.date)}</span>
        </div>
        <p className={`text-sm truncate ${!email.isRead ? "font-medium text-gray-800" : "text-gray-600"}`}>
          {email.subject}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{email.snippet}</p>
      </div>
    </button>
  );
}

export default function EmailList() {
  const { selectedLabel, selectedEmailId } = useEmailStore();
  const { data, isLoading, isError, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useEmails(selectedLabel);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const emails = data?.pages.flatMap((page) => page.emails) ?? [];

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 text-sm capitalize">{selectedLabel.toLowerCase()}</h2>
        {isFetching && !isLoading && (
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Email rows */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <EmailRowSkeleton key={i} />)
        ) : isError ? (
          <div className="p-8 text-center text-sm text-gray-500">
            <p>Failed to load emails.</p>
            <p className="mt-1 text-xs">Check your connection and try again.</p>
          </div>
        ) : !emails.length ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No emails in {selectedLabel.toLowerCase()}.
          </div>
        ) : (
          <>
            {emails.map((email) => (
              <EmailRow key={email.id} email={email} isSelected={email.id === selectedEmailId} />
            ))}
            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="py-2 text-center">
              {isFetchingNextPage && (
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
