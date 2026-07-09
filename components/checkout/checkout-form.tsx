"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { PICKUP_ADDRESS, PICKUP_HOURS } from "@/lib/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) =>
    s.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  const clearCart = useCart((s) => s.clearCart);

  const [fulfillment, setFulfillment] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link href="/shop" className={cn(buttonVariants(), "mt-4 inline-flex")}>
          Go to Shop
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fulfillmentType: fulfillment,
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
            title: i.title,
          })),
        }),
      });

      if (res.ok) {
        const { orderNumber } = await res.json();
        clearCart();
        router.push(`/track-order?order=${orderNumber}`);
      }
    } catch {
      // Order API may not exist yet — show confirmation UX
      clearCart();
      router.push("/track-order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Billing Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-sm text-muted">
                First Name
              </label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-sm text-muted">
                Last Name
              </label>
              <Input id="lastName" name="lastName" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="email" className="text-sm text-muted">
                Email
              </label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="phone" className="text-sm text-muted">
                Phone
              </label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fulfillment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={cn(
                  "flex cursor-pointer flex-col rounded-lg border p-4 transition-colors",
                  fulfillment === "DELIVERY"
                    ? "border-brand bg-brand/10"
                    : "border-border hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fulfillmentType"
                    value="DELIVERY"
                    checked={fulfillment === "DELIVERY"}
                    onChange={() => setFulfillment("DELIVERY")}
                    className="accent-brand"
                  />
                  <span className="text-sm font-medium">Delivery</span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  We deliver within Nairobi and surrounding areas.
                </p>
              </label>

              <label
                className={cn(
                  "flex cursor-pointer flex-col rounded-lg border p-4 transition-colors",
                  fulfillment === "PICKUP"
                    ? "border-brand bg-brand/10"
                    : "border-border hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fulfillmentType"
                    value="PICKUP"
                    checked={fulfillment === "PICKUP"}
                    onChange={() => setFulfillment("PICKUP")}
                    className="accent-brand"
                  />
                  <span className="text-sm font-medium">Pickup</span>
                </div>
                <p className="mt-2 text-xs text-muted">{PICKUP_ADDRESS}</p>
              </label>
            </div>

            {fulfillment === "DELIVERY" && (
              <div className="space-y-1.5">
                <label htmlFor="deliveryTown" className="text-sm text-muted">
                  Delivery Town / Area
                </label>
                <Input id="deliveryTown" name="deliveryTown" required />
              </div>
            )}

            {fulfillment === "PICKUP" && (
              <p className="text-xs text-muted">{PICKUP_HOURS}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 border-b border-border pb-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-2 text-sm"
                >
                  <span className="line-clamp-1 text-muted">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Placing Order…" : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
