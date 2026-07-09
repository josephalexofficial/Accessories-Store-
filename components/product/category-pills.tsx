import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryPillsProps {
  activeCategory?: string;
  basePath?: string;
  className?: string;
}

export function CategoryPills({
  activeCategory = "All Products",
  basePath = "/shop",
  className,
}: CategoryPillsProps) {
  return (
    <div
      className={cn(
        "scrollbar-none flex gap-2 overflow-x-auto pb-1",
        className
      )}
    >
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
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors md:text-sm",
              isActive
                ? "border-brand bg-brand text-white"
                : "border-border bg-card text-muted hover:border-white/30 hover:text-foreground"
            )}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
