export default function LearnLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b px-6 py-3.5 bg-card">
        <div className="w-24 h-5 bg-muted rounded animate-pulse" />
      </div>
      <div className="container mx-auto max-w-3xl py-10 px-4 space-y-4">
        <div className="w-48 h-7 bg-muted rounded animate-pulse mb-6" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border rounded-xl p-5 flex items-center gap-4">
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse shrink-0" />
            <div className="w-12 h-12 bg-muted rounded-xl animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-40 h-4 bg-muted rounded animate-pulse" />
              <div className="w-64 h-3 bg-muted rounded animate-pulse" />
              <div className="w-full h-1.5 bg-muted rounded-full animate-pulse mt-2" />
            </div>
            <div className="space-y-1 text-right shrink-0">
              <div className="w-14 h-3 bg-muted rounded animate-pulse" />
              <div className="w-16 h-3 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
