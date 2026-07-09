"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SortBarProps {
  className?: string;
}

export function SortBar({ className }: SortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "newest";

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <p className="text-sm text-muted">Sort by</p>
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
