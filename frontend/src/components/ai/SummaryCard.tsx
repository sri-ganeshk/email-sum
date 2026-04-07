export default function SummaryCard({ summary }: { summary: string }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Summary</p>
      <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
    </div>
  );
}
