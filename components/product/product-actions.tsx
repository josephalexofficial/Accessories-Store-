"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/store/cart";
import { type Product, getEffectivePrice } from "@/lib/product-types";
import { formatPrice } from "@/lib/utils";
import {
  buildProductInquiryMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { WhatsAppBrandIcon, WhatsAppIcon } from "@/components/shared/brand-icons";

interface ProductActionsProps {
  product: Product;
}

async function trackClick(productId: string) {
  try {
    await fetch("/api/whatsapp-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, page: "product-detail" }),
    });
  } catch {
    // Non-blocking analytics
  }
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const soldOut = product.stockStatus === "SOLD_OUT";
  const effectivePrice = getEffectivePrice(product);
  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.slug}`
      : `/products/${product.slug}`;

  function handleAddToCart() {
    addItem({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: effectivePrice,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function handleWhatsApp() {
    void trackClick(product.id);
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

  function handleBuyNow() {
    addItem({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: effectivePrice,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });
    router.push("/checkout");
  }

  return (
    <>
      {/* In-flow actions — desktop/tablet */}
      <div className="hidden flex-col gap-3 sm:flex">
        <div className="flex gap-3">
          <Button
            size="lg"
            className="h-12 flex-1 rounded-xl text-[15px] font-bold"
            onClick={handleAddToCart}
            disabled={soldOut}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Added to cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 flex-1 rounded-xl text-[15px] font-bold"
            onClick={handleBuyNow}
            disabled={soldOut}
          >
            <Zap className="h-4 w-4" />
            Buy Now
          </Button>
        </div>
        <Button
          size="lg"
          variant="whatsapp"
          className="h-12 w-full rounded-xl text-[15px] font-bold"
          onClick={handleWhatsApp}
        >
          <WhatsAppIcon className="h-4 w-4 text-white" />
          Inquire on WhatsApp
        </Button>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-canvas/95 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl active:scale-[0.98]"
            aria-label="Inquire on WhatsApp"
          >
            <WhatsAppBrandIcon className="h-11 w-11" />
          </button>
          <Button
            size="lg"
            className="h-11 min-w-0 flex-1 rounded-xl text-sm font-bold"
            onClick={handleAddToCart}
            disabled={soldOut}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 shrink-0 rounded-xl px-3.5 text-sm font-bold"
            onClick={handleBuyNow}
            disabled={soldOut}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </>
  );
}
