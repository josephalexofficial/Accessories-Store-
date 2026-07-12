export default function AdminLoginLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-brand-tint/50 via-canvas to-surface px-4">
      <div className="w-full max-w-md animate-pulse rounded-2xl border border-border bg-canvas p-8 shadow-sm">
        <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-brand/20" />
        <div className="mx-auto mb-2 h-5 w-48 rounded bg-brand-light" />
        <div className="mx-auto mb-8 h-4 w-24 rounded bg-brand-tint" />
        <div className="space-y-4">
          <div className="h-10 rounded-lg bg-brand-tint" />
          <div className="h-10 rounded-lg bg-brand-tint" />
          <div className="h-11 rounded-xl bg-brand/20" />
        </div>
      </div>
    </div>
  );
}
