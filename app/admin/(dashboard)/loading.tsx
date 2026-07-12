export default function AdminDashboardLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 w-56 rounded-lg bg-brand-light" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl border border-border bg-canvas shadow-sm"
          >
            <div className="flex h-full items-center justify-between p-5">
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-brand-tint" />
                <div className="h-5 w-28 rounded bg-brand-light" />
              </div>
              <div className="h-10 w-10 rounded-lg bg-brand-tint" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="h-64 rounded-xl border border-border bg-canvas lg:col-span-3" />
        <div className="h-64 rounded-xl border border-border bg-canvas lg:col-span-2" />
      </div>
    </div>
  );
}
