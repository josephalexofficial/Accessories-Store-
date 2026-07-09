export default function AdminDashboardLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent"
          aria-label="Loading"
        />
        <p className="text-sm text-muted">Loading...</p>
      </div>
    </div>
  );
}
