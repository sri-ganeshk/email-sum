export function EmailRowSkeleton() {
  return (
    <div className="animate-pulse flex items-start gap-3 px-4 py-3 border-b border-gray-100">
      <div className="w-2 h-2 mt-2 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="h-3 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export function AIPanelSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-32 mt-6" />
      <div className="border border-gray-200 rounded-lg p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}
