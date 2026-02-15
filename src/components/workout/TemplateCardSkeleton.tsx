export function TemplateCardSkeleton() {
  return (
    <div className="w-full rounded-lg p-4 bg-background animate-pulse">
      <div className="flex items-start justify-between gap-3">
        {/* Left side - Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Title */}
          <div className="h-5 bg-gray-700/50 rounded w-2/3"></div>
          
          {/* Description - 2 lines */}
          <div className="space-y-2">
            <div className="h-3.5 bg-gray-700/30 rounded w-full"></div>
            <div className="h-3.5 bg-gray-700/30 rounded w-4/5"></div>
          </div>
          
          {/* Metadata row - exercises + duration */}
          <div className="flex items-center gap-3">
            <div className="h-3 bg-gray-700/40 rounded w-24"></div>
            <div className="w-1 h-1 bg-gray-700/40 rounded-full"></div>
            <div className="h-3 bg-gray-700/40 rounded w-16"></div>
          </div>
        </div>

        {/* Right side - Badges */}
        <div className="flex flex-col items-end gap-2">
          {/* Difficulty badge */}
          <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
          {/* Equipment badge */}
          <div className="h-6 bg-gray-700/40 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
}
