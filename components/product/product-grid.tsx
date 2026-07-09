import { type Product } from "@/lib/products";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  className?: string;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  className,
  emptyMessage = "No products found.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
