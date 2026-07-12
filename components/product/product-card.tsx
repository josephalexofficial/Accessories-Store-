"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/shared/brand-icons";
import { type Product, getEffectivePrice } from "@/lib/product-types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import {
  buildProductInquiryMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";

interface ProductCardProps {
  product: Product;
  className?: string;
}

async function trackClick(productId: string) {
  try {
    await fetch("/api/whatsapp-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, page: "product-card" }),
    });
  } catch {
    // Non-blocking analytics
  }
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const effectivePrice = getEffectivePrice(product);
  const soldOut = product.stockStatus === "SOLD_OUT";
  const href = `/products/${product.slug}`;

  function handleShopNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: effectivePrice,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });
    window.location.href = "/checkout";
  }

  function handleWhatsApp(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    void trackClick(product.id);
    const productUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${href}`
        : href;
    const message = buildProductInquiryMessage({
      title: product.title,
      brand: product.brand,
      price: formatPrice(effectivePrice),
      url: productUrl,
      isDeal: product.isSale,
      originalPrice: product.isSale ? formatPrice(product.price) : undefined,
    });
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-canvas shadow-sm transition-shadow hover:shadow-md",
        soldOut && "opacity-75",
        className
      )}
    >
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden bg-[#f3f4f6]"
        tabIndex={-1}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-subtle">
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
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
          {product.brand}
        </p>
        <Link href={href} className="mt-0.5">
          <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-ink sm:text-sm">
            {product.title}
          </h3>
        </Link>

        <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-bold text-[#16a34a] sm:text-[15px]">
            {formatPrice(effectivePrice)}
          </span>
          {product.isSale && product.salePrice != null && (
            <span className="text-[11px] text-ink-subtle line-through sm:text-xs">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={href}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-brand bg-canvas px-2.5 text-[11px] font-semibold text-brand transition-colors hover:bg-brand-tint sm:h-9 sm:px-3 sm:text-[12px]"
            >
              Show details
            </Link>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-transform hover:scale-105 hover:brightness-110 sm:h-9 sm:w-9"
              aria-label={`Inquire on WhatsApp about ${product.title}`}
            >
              <WhatsAppIcon className="h-4 w-4 text-white sm:h-[1.125rem] sm:w-[1.125rem]" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleShopNow}
            disabled={soldOut}
            className={cn(
              "inline-flex h-9 w-full items-center justify-center rounded-lg bg-[#16a34a] px-3 text-[12px] font-bold text-white transition-colors hover:bg-[#15803d] sm:rounded-xl sm:text-[13px]",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            Shop Now
          </button>
        </div>
      </div>
    </article>
  );
}
