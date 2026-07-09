import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ShopSidebarProps {
  activeCategory?: string;
  basePath?: string;
  className?: string;
}

export function ShopSidebar({
  activeCategory = "All Products",
  basePath = "/shop",
  className,
}: ShopSidebarProps) {
  return (
    <aside className={cn("space-y-2", className)}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
        Categories
      </h2>
      <nav className="flex flex-col gap-0.5" aria-label="Category filters">
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
    </aside>
  );
}
