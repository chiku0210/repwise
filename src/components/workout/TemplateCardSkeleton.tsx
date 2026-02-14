export function TemplateCardSkeleton() {
  return (
    <div className="w-full bg-card border border-border rounded-xl p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
          <div className="flex items-center gap-3">
            <div className="h-5 bg-muted rounded-full w-20"></div>
            <div className="h-5 bg-muted rounded w-16"></div>
          </div>
        </div>
        <div className="w-5 h-5 bg-muted rounded flex-shrink-0 mt-1"></div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-border/50">
        <div className="h-5 bg-muted rounded w-24"></div>
        <div className="flex items-center gap-1.5">
          <div className="h-6 bg-muted rounded-full w-16"></div>
          <div className="h-6 bg-muted rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
}
