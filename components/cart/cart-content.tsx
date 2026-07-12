"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CartContent() {
  const items = useCart((s) => s.items);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) =>
    s.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  if (!hasHydrated) {
    return (
      <div className="rounded-xl border border-border py-16 text-center text-sm text-muted">
        Loading cart…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-muted" />
        <h2 className="text-lg font-semibold text-foreground">Your cart is empty</h2>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Browse our collection and add items to get started.
        </p>
        <Link href="/shop" className={cn(buttonVariants(), "mt-6")}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex gap-4 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-muted">
                    No img
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted">
                      {item.brand}
                    </p>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-foreground hover:text-brand"
                    >
                      {item.title}
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded p-1 text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-brand-light hover:text-brand"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-brand-light hover:text-brand"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Card className="sticky top-20">
          <div className="p-6 pb-0">
            <h3 className="text-lg font-semibold">Order Summary</h3>
          </div>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted">
              Shipping calculated at checkout.
            </p>
            <Link
              href="/checkout"
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Continue Shopping
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
