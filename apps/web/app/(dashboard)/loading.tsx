export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 animate-pulse">
        <div className="h-9 bg-[var(--subtle-bg)] rounded w-64 mb-2" />
        <div className="h-5 bg-[var(--subtle-bg)] rounded w-48" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-[var(--subtle-bg)] rounded w-32" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <div className="w-7 h-7 bg-[var(--subtle-bg)] rounded-full" />
                    <div className="flex-1 h-5 bg-[var(--subtle-bg)] rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-[var(--subtle-bg)] rounded w-24 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-[var(--subtle-bg)] rounded" />
                <div className="h-4 bg-[var(--subtle-bg)] rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
