"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryPillsProps {
  activeCategory?: string;
  basePath?: string;
  className?: string;
  showScrollHint?: boolean;
}

function categoryHref(
  basePath: string,
  category: string,
  searchParams: URLSearchParams,
  preserveParams: boolean
) {
  if (!preserveParams) {
    return category === "All Products"
      ? basePath
      : `${basePath}?category=${encodeURIComponent(category)}`;
  }

  const params = new URLSearchParams(searchParams.toString());
  if (category === "All Products") {
    params.delete("category");
  } else {
    params.set("category", category);
  }
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function CategoryPills({
  activeCategory = "All Products",
  basePath,
  className,
  showScrollHint = false,
}: CategoryPillsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const path = basePath ?? pathname;
  const preserveParams = path === "/shop" || path === "/deals";

  return (
    <div className={className}>
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-0.5">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          const href = categoryHref(
            path,
            category,
            searchParams,
            preserveParams
          );

          return (
            <Link
              key={category}
              href={href}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all md:px-5 md:text-sm",
                isActive
                  ? "border-brand bg-brand text-white shadow-sm"
                  : "border-border bg-canvas text-ink-muted hover:border-brand/40 hover:text-brand"
              )}
            >
              {category === "All Products" ? "All" : category}
            </Link>
          );
        })}
      </div>
      {showScrollHint && (
        <div className="mt-2.5 flex items-center gap-2 md:mt-3">
          <ChevronLeft className="h-3 w-3 shrink-0 text-ink-subtle/70" aria-hidden />
          <div className="h-px flex-1 bg-border" />
          <ChevronRight className="h-3 w-3 shrink-0 text-ink-subtle/70" aria-hidden />
        </div>
      )}
    </div>
  );
}
