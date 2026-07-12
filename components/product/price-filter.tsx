"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PriceFilterProps {
  className?: string;
}

export function PriceFilter({ className }: PriceFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [min, setMin] = useState(searchParams.get("min") ?? "");
  const [max, setMax] = useState(searchParams.get("max") ?? "");

  useEffect(() => {
    setMin(searchParams.get("min") ?? "");
    setMax(searchParams.get("max") ?? "");
  }, [searchParams]);

  function applyFilter(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    const minValue = min.trim();
    const maxValue = max.trim();

    if (minValue) params.set("min", minValue);
    else params.delete("min");

    if (maxValue) params.set("max", maxValue);
    else params.delete("max");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function clearFilter() {
    setMin("");
    setMax("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("min");
    params.delete("max");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const hasFilter = Boolean(searchParams.get("min") || searchParams.get("max"));

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-4 shadow-sm",
        className
      )}
    >
      <h3 className="text-sm font-bold text-ink">Price (KSh)</h3>
      <form onSubmit={applyFilter} className="mt-3 space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            aria-label="Minimum price"
          />
          <span className="shrink-0 text-ink-subtle">-</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            aria-label="Maximum price"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#16a34a] text-sm font-bold text-white transition-colors hover:bg-[#15803d]"
        >
          Apply
        </button>
        {hasFilter && (
          <button
            type="button"
            onClick={clearFilter}
            className="w-full text-center text-xs font-semibold text-ink-muted hover:text-brand"
          >
            Clear price filter
          </button>
        )}
      </form>
    </div>
  );
}
