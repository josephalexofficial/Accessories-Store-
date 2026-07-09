import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { type Product, getEffectivePrice } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const effectivePrice = getEffectivePrice(product);
  const soldOut = product.stockStatus === "SOLD_OUT";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-white/20 hover:shadow-lg hover:shadow-black/20",
        soldOut && "opacity-75",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            No image
          </div>
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isSale && <Badge variant="sale">Deal</Badge>}
          {soldOut && <Badge variant="soldOut">Sold Out</Badge>}
          {product.stockStatus === "LOW_STOCK" && !soldOut && (
            <Badge variant="warning">Low Stock</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {product.title}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(effectivePrice)}
          </span>
          {product.isSale && product.salePrice != null && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
