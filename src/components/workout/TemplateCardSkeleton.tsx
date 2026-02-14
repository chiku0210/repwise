export function TemplateCardSkeleton() {
  return (
    <div className="w-full bg-muted border border-border rounded-lg p-4 space-y-3 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-5 bg-muted-foreground/20 rounded w-2/3" />
        <div className="flex items-center gap-2">
          <div className="h-4 bg-muted-foreground/20 rounded w-16" />
          <div className="h-4 bg-muted-foreground/20 rounded w-12" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <div className="h-4 bg-muted-foreground/20 rounded w-full" />
        <div className="h-4 bg-muted-foreground/20 rounded w-4/5" />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2">
        <div className="h-3 bg-muted-foreground/20 rounded w-20" />
        <div className="h-3 bg-muted-foreground/20 rounded w-24" />
      </div>
    </div>
  );
}
