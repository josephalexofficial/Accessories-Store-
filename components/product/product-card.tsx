import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { type Product, getEffectivePrice } from "@/lib/product-types";
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
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-canvas card-elevated hover:border-brand/40",
        soldOut && "opacity-75",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
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
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-tint to-surface text-xs text-ink-subtle">
            No image
          </div>
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isSale && <Badge variant="sale">Sale</Badge>}
          {soldOut && <Badge variant="soldOut">Sold Out</Badge>}
          {product.stockStatus === "LOW_STOCK" && !soldOut && (
            <Badge variant="warning">Low Stock</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink">
          {product.title}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-sm font-bold text-brand">
            {formatPrice(effectivePrice)}
          </span>
          {product.isSale && product.salePrice != null && (
            <span className="text-xs text-ink-subtle line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
