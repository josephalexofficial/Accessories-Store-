"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PriceFilter } from "./price-filter";

interface ShopSidebarProps {
  activeCategory?: string;
  basePath?: string;
  className?: string;
}

function categoryHref(
  basePath: string,
  category: string,
  searchParams: URLSearchParams
) {
  const params = new URLSearchParams(searchParams.toString());
  if (category === "All Products") {
    params.delete("category");
  } else {
    params.set("category", category);
  }
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function ShopSidebar({
  activeCategory = "All Products",
  basePath,
  className,
}: ShopSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const path = basePath ?? pathname;

  return (
    <aside className={cn("space-y-6", className)}>
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Categories
        </h2>
        <nav className="flex flex-col gap-0.5" aria-label="Category filters">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <Link
                key={category}
                href={categoryHref(path, category, searchParams)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-brand-light font-semibold text-brand"
                    : "text-ink-muted hover:bg-brand-tint hover:text-brand"
                )}
              >
                {category}
              </Link>
            );
          })}
        </nav>
      </div>

      <PriceFilter />
    </aside>
  );
}
