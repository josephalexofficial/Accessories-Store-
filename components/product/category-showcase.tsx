import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Product } from "@/lib/product-types";
import { ProductGrid } from "./product-grid";

interface CategoryShowcaseProps {
  category: string;
  products: Product[];
  seeMoreLabel?: string;
  title?: string;
}

export function CategoryShowcase({
  category,
  products,
  seeMoreLabel = "View all",
  title,
}: CategoryShowcaseProps) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand md:text-xl">
          {title ?? category}
        </h2>
        <Link
          href={`/shop?category=${encodeURIComponent(category)}`}
          className="flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:underline"
        >
          {seeMoreLabel}
          {seeMoreLabel === "View all" && <ArrowRight className="h-4 w-4" />}
        </Link>
      </div>
      <ProductGrid products={products.slice(0, 5)} />
    </section>
  );
}
