"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileFiltersSortProps {
  className?: string;
}

export function MobileFiltersSort({ className }: MobileFiltersSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") ?? "popularity");
  const [min, setMin] = useState(searchParams.get("min") ?? "");
  const [max, setMax] = useState(searchParams.get("max") ?? "");

  useEffect(() => {
    setSort(searchParams.get("sort") ?? "popularity");
    setMin(searchParams.get("min") ?? "");
    setMax(searchParams.get("max") ?? "");
  }, [searchParams]);

  const hasActiveFilters = Boolean(
    searchParams.get("min") ||
      searchParams.get("max") ||
      (searchParams.get("sort") && searchParams.get("sort") !== "popularity")
  );

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (sort === "popularity") params.delete("sort");
    else params.set("sort", sort);

    const minValue = min.trim();
    const maxValue = max.trim();
    if (minValue) params.set("min", minValue);
    else params.delete("min");
    if (maxValue) params.set("max", maxValue);
    else params.delete("max");

    params.delete("page");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
    setOpen(false);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-left shadow-sm"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-bold text-ink">
          <SlidersHorizontal className="h-4 w-4 text-ink-muted" />
          Filters & Sort
          {hasActiveFilters && (
            <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
              On
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-ink-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <form
          onSubmit={applyFilters}
          className="space-y-5 rounded-xl border border-border bg-white p-4 shadow-sm"
        >
          <div>
            <label
              htmlFor="mobile-sort"
              className="mb-2 block text-sm font-bold text-ink"
            >
              Sort by
            </label>
            <select
              id="mobile-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-ink">Price (KSh)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                placeholder="Min"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
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
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                aria-label="Maximum price"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#16a34a] text-sm font-bold text-white transition-colors hover:bg-[#15803d]"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
}
