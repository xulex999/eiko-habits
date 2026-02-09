export default function MarketingLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] animate-pulse">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="h-8 w-32 bg-[var(--subtle-bg)] rounded" />
        <div className="flex gap-4">
          <div className="h-8 w-20 bg-[var(--subtle-bg)] rounded" />
          <div className="h-8 w-24 bg-[var(--subtle-bg)] rounded" />
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="h-16 bg-[var(--subtle-bg)] rounded mx-auto mb-6" />
        <div className="h-6 bg-[var(--subtle-bg)] rounded w-3/4 mx-auto" />
      </div>
    </div>
  );
}
