export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar skeleton */}
      <div className="border-b px-6 py-3.5 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
          <div className="w-20 h-5 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-4 bg-muted rounded animate-pulse" />
          <div className="w-20 h-4 bg-muted rounded animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto max-w-5xl py-8 px-4 space-y-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1 space-y-2">
            <div className="w-56 h-7 bg-muted rounded animate-pulse" />
            <div className="w-72 h-4 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-48 space-y-1">
            <div className="w-32 h-3 bg-muted rounded animate-pulse ml-auto" />
            <div className="w-48 h-2 bg-muted rounded-full animate-pulse" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-xl p-4 bg-card space-y-2">
              <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
              <div className="w-12 h-6 bg-muted rounded animate-pulse" />
              <div className="w-20 h-3 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Continue learning */}
        <div className="space-y-3">
          <div className="w-36 h-5 bg-muted rounded animate-pulse" />
          <div className="border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-xl animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-24 h-3 bg-muted rounded animate-pulse" />
              <div className="w-48 h-4 bg-muted rounded animate-pulse" />
              <div className="w-16 h-3 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Module cards */}
        <div className="space-y-3">
          <div className="w-24 h-5 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-xl p-4 bg-card space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg animate-pulse shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-28 h-4 bg-muted rounded animate-pulse" />
                    <div className="w-16 h-3 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-muted rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
