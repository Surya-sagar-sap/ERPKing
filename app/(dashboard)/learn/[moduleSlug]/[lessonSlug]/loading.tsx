export default function LessonLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b px-6 py-3 bg-card">
        <div className="flex items-center gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-16 h-4 bg-muted rounded animate-pulse" />
              {i < 3 && <div className="w-3 h-3 bg-muted rounded animate-pulse" />}
            </div>
          ))}
        </div>
      </div>
      {/* Progress strip */}
      <div className="w-full h-1 bg-muted">
        <div className="h-full w-1/3 bg-primary/30 animate-pulse" />
      </div>

      <div className="container mx-auto max-w-3xl py-10 px-4 space-y-8">
        {/* Title */}
        <div className="space-y-3">
          <div className="w-24 h-5 bg-muted rounded animate-pulse" />
          <div className="w-72 h-8 bg-muted rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="w-20 h-5 bg-muted rounded animate-pulse" />
            <div className="w-16 h-5 bg-muted rounded animate-pulse" />
            <div className="w-16 h-5 bg-muted rounded animate-pulse" />
          </div>
        </div>
        {/* Story box */}
        <div className="border rounded-xl p-5 space-y-2">
          <div className="w-32 h-4 bg-muted rounded animate-pulse" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-3 bg-muted rounded animate-pulse" />
          ))}
        </div>
        {/* Content */}
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-3 bg-muted rounded animate-pulse ${i % 3 === 2 ? "w-3/4" : "w-full"}`} />
          ))}
        </div>
        {/* Flowchart placeholder */}
        <div className="border rounded-xl h-64 bg-muted/30 animate-pulse" />
      </div>
    </div>
  );
}
