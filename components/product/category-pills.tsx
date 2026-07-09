import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryPillsProps {
  activeCategory?: string;
  basePath?: string;
  className?: string;
  showScrollHint?: boolean;
}

export function CategoryPills({
  activeCategory = "All Products",
  basePath = "/shop",
  className,
  showScrollHint = false,
}: CategoryPillsProps) {
  return (
    <div className={className}>
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-0.5">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          const href =
            category === "All Products"
              ? basePath
              : `${basePath}?category=${encodeURIComponent(category)}`;

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
