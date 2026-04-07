import { ExtractedEvent } from "../../types/ai";
import { useAddToCalendar } from "../../api/queries/useCalendar";

function normalizeTime(time: string): string {
  // Strip timezone abbreviations like IST, EST, PST, GMT+5:30, etc.
  // "01:00 PM IST" → "01:00 PM"
  const stripped = time.replace(/\s+[A-Z]{2,5}(\+[\d:]+)?$/, "").trim();

  // Convert 12-hour to 24-hour for reliable Date parsing
  // "01:00 PM" → "13:00", "09:30 AM" → "09:30"
  const match = stripped.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const meridiem = match[3].toUpperCase();
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }
  return stripped;
}

function parseDateTime(date: string | null, time: string | null): { start: string; end: string } | null {
  if (!date) return null;
  try {
    // Already ISO — use directly
    if (date.includes("T")) {
      const start = new Date(date);
      if (!isNaN(start.getTime())) {
        return { start: start.toISOString(), end: new Date(start.getTime() + 60 * 60 * 1000).toISOString() };
      }
    }

    // Parse natural language date: "7 Apr 2026", "April 7 2026", "2026-04-07", etc.
    const parsedDate = new Date(date);
    const timeStr = time ? normalizeTime(time) : "09:00";

    // Build combined string: "7 Apr 2026 13:00"
    const combined = new Date(`${date} ${timeStr}`);
    const start = isNaN(combined.getTime()) ? parsedDate : combined;

    if (isNaN(start.getTime())) return null;
    return { start: start.toISOString(), end: new Date(start.getTime() + 60 * 60 * 1000).toISOString() };
  } catch {
    return null;
  }
}

export default function EventCard({ event }: { event: ExtractedEvent }) {
  const { mutate: addToCalendar, isPending } = useAddToCalendar();
  const dateTime = parseDateTime(event.date, event.time);

  const handleAddToCalendar = () => {
    if (!dateTime) return;
    addToCalendar({
      title: event.title,
      startDateTime: dateTime.start,
      endDateTime: dateTime.end,
      location: event.location ?? undefined,
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
          {event.date && (
            <p className="text-xs text-gray-500 mt-0.5">
              {event.date}
              {event.time && ` at ${event.time}`}
            </p>
          )}
          {event.location && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{event.location}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            <div className="h-1 bg-gray-100 rounded-full flex-1">
              <div
                className="h-1 bg-blue-400 rounded-full"
                style={{ width: `${Math.round(event.confidence * 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{Math.round(event.confidence * 100)}%</span>
          </div>
        </div>

        <button
          onClick={handleAddToCalendar}
          disabled={isPending || !dateTime}
          title={!dateTime ? "No parseable date/time to add" : "Add to Google Calendar"}
          className="flex-shrink-0 flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white
                     rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {isPending ? (
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          Add
        </button>
      </div>
    </div>
  );
}
