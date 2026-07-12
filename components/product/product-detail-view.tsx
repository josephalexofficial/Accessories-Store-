import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Product, getEffectivePrice } from "@/lib/product-types";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_DETAIL_SIZES } from "@/lib/product-image";
import { ProductImage } from "./product-image";
import { ProductActions } from "./product-actions";
import { ProductSpecs } from "./product-specs";

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const effectivePrice = getEffectivePrice(product);
  const soldOut = product.stockStatus === "SOLD_OUT";
  const shopCategoryHref = `/shop?category=${encodeURIComponent(product.category)}`;

  return (
    <div className="pb-24 sm:pb-0">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ink-subtle md:mb-6 md:text-sm"
      >
        <Link href="/shop" className="font-medium transition-colors hover:text-brand">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
        <Link
          href={shopCategoryHref}
          className="font-medium transition-colors hover:text-brand"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
        <span className="line-clamp-1 font-semibold text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
        {/* Image */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_10px_40px_rgba(0,86,210,0.08)] md:sticky md:top-24">
            {product.imageUrl ? (
              <ProductImage
                src={product.imageUrl}
                alt={product.title}
                sizes={PRODUCT_DETAIL_SIZES}
                quality={75}
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-ink-subtle">
                No image available
              </div>
            )}

            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 md:left-4 md:top-4">
              {product.isSale && <Badge variant="sale">Deal</Badge>}
              {soldOut && <Badge variant="soldOut">Sold Out</Badge>}
              {product.stockStatus === "LOW_STOCK" && !soldOut && (
                <Badge variant="warning">Low Stock</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-col">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand md:text-xs">
            {product.brand}
          </p>
          <h1 className="mt-1.5 text-[1.55rem] font-black leading-[1.15] tracking-tight text-ink sm:text-3xl md:text-[2rem] lg:text-[2.15rem]">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-2xl font-black tracking-tight text-[#16a34a] md:text-3xl">
              {formatPrice(effectivePrice)}
            </span>
            {product.isSale && product.salePrice != null && (
              <span className="pb-0.5 text-base text-ink-subtle line-through md:text-lg">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-[15px]">
            Genuine {product.category.toLowerCase()} from {product.brand}. Order
            online — we deliver across Kenya.
          </p>

          <div className="sm:mt-5 md:mt-6">
            <ProductActions product={product} />
          </div>

          <div className="mt-7 rounded-2xl border border-border bg-canvas p-4 shadow-sm md:mt-10 md:p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-subtle">
              Specifications
            </h2>
            <div className="mt-1">
              <ProductSpecs
                specType={product.specType}
                specifications={product.specifications}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
