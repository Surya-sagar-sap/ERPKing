export default function ModuleLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b px-6 py-3 bg-card">
        <div className="flex items-center gap-2">
          <div className="w-16 h-4 bg-muted rounded animate-pulse" />
          <div className="w-3 h-3 bg-muted rounded animate-pulse" />
          <div className="w-24 h-4 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="container mx-auto max-w-3xl py-10 px-4">
        {/* Module header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-muted rounded-2xl animate-pulse shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="w-40 h-6 bg-muted rounded animate-pulse" />
            <div className="w-72 h-4 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full animate-pulse mb-8" />
        {/* Lessons */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-xl p-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-48 h-4 bg-muted rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="w-16 h-3 bg-muted rounded animate-pulse" />
                  <div className="w-12 h-3 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
