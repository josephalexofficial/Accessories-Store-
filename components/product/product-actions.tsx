"use client";

import { useCart } from "@/store/cart";
import { type Product, getEffectivePrice } from "@/lib/product-types";
import { formatPrice } from "@/lib/utils";
import {
  buildProductInquiryMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/brand-icons";
import { ShoppingCart } from "lucide-react";

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
  const addItem = useCart((s) => s.addItem);
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
    handleAddToCart();
    window.location.href = "/checkout";
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        size="lg"
        className="flex-1"
        onClick={handleAddToCart}
        disabled={soldOut}
      >
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </Button>
      <Button
        size="lg"
        variant="whatsapp"
        className="flex-1"
        onClick={handleWhatsApp}
      >
        <WhatsAppIcon className="h-4 w-4 text-white" />
        Inquire on WhatsApp
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="flex-1"
        onClick={handleBuyNow}
        disabled={soldOut}
      >
        Buy Now
      </Button>
    </div>
  );
}
