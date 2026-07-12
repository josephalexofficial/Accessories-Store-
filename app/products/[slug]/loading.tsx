import { StoreLayout } from "@/components/layout/store-layout";

export default function ProductLoading() {
  return (
    <StoreLayout>
      <div className="bg-gradient-to-b from-brand-tint/40 via-canvas to-canvas">
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-5 md:px-6 md:py-10">
          <div className="mb-6 h-3 w-48 rounded bg-brand-light md:mb-8" />
          <div className="grid gap-6 md:grid-cols-2 md:gap-10">
            <div className="aspect-square rounded-2xl bg-brand-tint" />
            <div className="space-y-4">
              <div className="h-3 w-24 rounded bg-brand-light" />
              <div className="h-9 w-full max-w-md rounded-lg bg-brand-light" />
              <div className="h-8 w-36 rounded bg-brand-light" />
              <div className="h-4 w-72 max-w-full rounded bg-brand-tint" />
              <div className="flex gap-3 pt-2">
                <div className="h-12 flex-1 rounded-xl bg-brand/20" />
                <div className="h-12 flex-1 rounded-xl bg-brand-light" />
              </div>
              <div className="mt-6 h-40 rounded-2xl border border-border bg-canvas" />
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
