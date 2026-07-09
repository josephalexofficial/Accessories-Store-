"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildGeneralInquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export function TrackOrderForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const params = new URLSearchParams({ orderNumber: orderId, email });
      const res = await fetch(`/api/orders/track?${params}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data.orderStatus ?? "PENDING");
      } else {
        setStatus("NOT_FOUND");
      }
    } catch {
      setStatus("NOT_FOUND");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
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
              placeholder="e.g. WHM-12345"
              required
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
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <Search className="h-4 w-4" />
            {loading ? "Searching…" : "Track Order"}
          </Button>
        </form>

        {status && (
          <div className="mt-6 rounded-lg border border-border bg-white/[0.02] p-4 text-center">
            {status === "NOT_FOUND" ? (
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
            ) : (
              <p className="text-sm">
                Order status:{" "}
                <span className="font-semibold text-brand">{status}</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
