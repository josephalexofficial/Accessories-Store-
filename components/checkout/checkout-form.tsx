"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { PICKUP_ADDRESS, PICKUP_HOURS } from "@/lib/constants";
import type { DeliveryLocationOption } from "@/lib/delivery-location-types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryLocationSelect } from "@/components/checkout/delivery-location-select";
import { cn } from "@/lib/utils";

interface CheckoutFormProps {
  locations: DeliveryLocationOption[];
}

export function CheckoutForm({ locations }: CheckoutFormProps) {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) =>
    s.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  const clearCart = useCart((s) => s.clearCart);
  const hasHydrated = useCart((s) => s.hasHydrated);

  const [fulfillment, setFulfillment] = useState<"DELIVERY" | "PICKUP">(
    "DELIVERY"
  );
  const [selectedLocation, setSelectedLocation] =
    useState<DeliveryLocationOption | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shipping =
    fulfillment === "DELIVERY" && selectedLocation ? selectedLocation.fee : 0;
  const total = subtotal + shipping;

  if (!hasHydrated) {
    return (
      <div className="rounded-xl border border-border py-16 text-center text-sm text-muted">
        Loading checkout…
      </div>
    );
  }

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
    setError("");

    if (fulfillment === "DELIVERY" && !selectedLocation) {
      setError("Please select a delivery location.");
      return;
    }

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
          deliveryLocationId:
            fulfillment === "DELIVERY" ? selectedLocation?.id : undefined,
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
            title: i.title,
          })),
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(payload.error ?? "Could not place order. Please try again.");
        return;
      }

      clearCart();
      router.push(`/track-order?order=${payload.orderNumber}`);
    } catch {
      setError("Could not place order. Please try again.");
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
                    : "border-border hover:border-brand/40"
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
                  We deliver across Kenya. Select your town to see the shipping
                  fee.
                </p>
              </label>

              <label
                className={cn(
                  "flex cursor-pointer flex-col rounded-lg border p-4 transition-colors",
                  fulfillment === "PICKUP"
                    ? "border-brand bg-brand/10"
                    : "border-border hover:border-brand/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fulfillmentType"
                    value="PICKUP"
                    checked={fulfillment === "PICKUP"}
                    onChange={() => {
                      setFulfillment("PICKUP");
                      setSelectedLocation(null);
                    }}
                    className="accent-brand"
                  />
                  <span className="text-sm font-medium">Pickup</span>
                </div>
                <p className="mt-2 text-xs text-muted">{PICKUP_ADDRESS}</p>
              </label>
            </div>

            {fulfillment === "DELIVERY" && (
              <DeliveryLocationSelect
                locations={locations}
                value={selectedLocation}
                onChange={setSelectedLocation}
                required
              />
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

            <div className="space-y-2 border-b border-border pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>

              {fulfillment === "DELIVERY" && selectedLocation ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">
                    Shipping ({selectedLocation.name})
                  </span>
                  <span className="font-semibold">
                    {formatPrice(selectedLocation.fee)}
                  </span>
                </div>
              ) : fulfillment === "PICKUP" ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="font-semibold">{formatPrice(0)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="text-xs text-ink-subtle">
                    Select a town
                  </span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-brand">{formatPrice(total)}</span>
              </div>
            </div>

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

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
