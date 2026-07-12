"use client";

import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderStatusTimeline } from "@/components/shared/order-status-timeline";
import { formatPrice } from "@/lib/utils";
import {
  orderStatusBadgeVariant,
  paymentStatusBadgeVariant,
} from "@/lib/order-status";
import { buildGeneralInquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type TrackResult = {
  orderNumber: string;
  status: string;
  statusLabel: string;
  statusDescription: string;
  statusNote: string | null;
  statusUpdatedAt: string | null;
  paymentStatus: string;
  paymentStatusLabel: string;
  total: number;
  shipping: number;
  fulfillmentType: "DELIVERY" | "PICKUP";
  deliveryTown: string | null;
  createdAt: string;
  items: Array<{ title: string; quantity: number; price: number }>;
};

export function TrackOrderForm({
  initialOrderNumber = "",
}: {
  initialOrderNumber?: string;
}) {
  const [orderId, setOrderId] = useState(initialOrderNumber);
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialOrderNumber) setOrderId(initialOrderNumber);
  }, [initialOrderNumber]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderId.trim(),
          email: email.trim(),
        }),
      });

      if (!res.ok) {
        setNotFound(true);
        return;
      }

      const data = (await res.json()) as TrackResult;
      setResult(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Track Your Order</CardTitle>
        <p className="text-sm text-muted">
          Enter your order ID and email to check status.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="orderId" className="text-sm text-muted">
              Order ID
            </label>
            <Input
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. WH-M5ABCXYZ-A1B2"
              required
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-muted">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? "Searching…" : "Track Order"}
          </Button>
        </form>

        {notFound ? (
          <div className="mt-6 rounded-xl border border-border bg-surface/40 p-4 text-center">
            <p className="text-sm text-muted">
              Order not found. Please check your details or{" "}
              <a
                href={buildWhatsAppUrl(buildGeneralInquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                contact us on WhatsApp
              </a>
              .
            </p>
          </div>
        ) : null}

        {result ? (
          <div className="mt-6 space-y-4 rounded-xl border border-border bg-surface/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-sm font-semibold text-ink">
                  {result.orderNumber}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Placed{" "}
                  {new Date(result.createdAt).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant={orderStatusBadgeVariant(result.status)}>
                  {result.statusLabel}
                </Badge>
                <Badge
                  variant={paymentStatusBadgeVariant(result.paymentStatus)}
                >
                  {result.paymentStatusLabel}
                </Badge>
              </div>
            </div>

            <OrderStatusTimeline status={result.status} compact />

            <p className="text-sm text-ink">{result.statusDescription}</p>

            {result.statusNote ? (
              <p className="rounded-lg border border-brand/20 bg-brand-tint/40 px-3 py-2 text-sm text-ink">
                {result.statusNote}
              </p>
            ) : null}

            <div className="border-t border-border pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Items
              </p>
              <ul className="space-y-1.5">
                {result.items.map((item, index) => (
                  <li
                    key={`${item.title}-${index}`}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 truncate text-ink">
                      {item.title}{" "}
                      <span className="text-muted">×{item.quantity}</span>
                    </span>
                    <span className="shrink-0 font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-bold">
                <span>Total</span>
                <span>{formatPrice(result.total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {result.fulfillmentType === "DELIVERY"
                  ? result.deliveryTown
                    ? `Delivery to ${result.deliveryTown}`
                    : "Delivery"
                  : "Store pickup"}
                {result.shipping > 0
                  ? ` · Shipping ${formatPrice(result.shipping)}`
                  : ""}
              </p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
