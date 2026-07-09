export function PageLoader() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 h-8 w-48 rounded-lg bg-brand-light" />
      <div className="mb-4 h-4 w-72 rounded bg-brand-tint" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-canvas"
          >
            <div className="aspect-square bg-brand-tint" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-16 rounded bg-brand-light" />
              <div className="h-4 w-full rounded bg-brand-light" />
              <div className="h-4 w-20 rounded bg-brand-light" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroLoader() {
  return (
    <div className="animate-pulse border-b border-border bg-canvas px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-4 w-48 rounded bg-brand-light" />
          <div className="h-12 w-full max-w-md rounded-lg bg-brand-light" />
          <div className="h-4 w-80 max-w-full rounded bg-brand-tint" />
          <div className="flex gap-3 pt-4">
            <div className="h-12 w-32 rounded-full bg-brand/20" />
            <div className="h-12 w-32 rounded-full bg-brand-light" />
          </div>
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-brand-tint" />
      </div>
    </div>
  );
}
