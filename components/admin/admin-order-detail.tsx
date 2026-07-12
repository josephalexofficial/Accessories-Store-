"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminPanel } from "@/components/admin/admin-ui";
import { OrderStatusTimeline } from "@/components/shared/order-status-timeline";
import { formatPrice, cn } from "@/lib/utils";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
  orderStatusBadgeVariant,
  orderStatusLabel,
  paymentStatusBadgeVariant,
  paymentStatusLabel,
  type OrderStatusValue,
  type PaymentStatusValue,
} from "@/lib/order-status";
import {
  buildOrderStatusMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";

export type AdminOrderDetailData = {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fulfillmentType: "DELIVERY" | "PICKUP";
  deliveryTown: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  statusNote: string | null;
  statusUpdatedAt: string | null;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      slug: string;
      imageUrl: string | null;
      brand: string;
    };
  }>;
};

export function AdminOrderDetail({ order }: { order: AdminOrderDetailData }) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [statusNote, setStatusNote] = useState(order.statusNote ?? "");
  const [statusUpdatedAt, setStatusUpdatedAt] = useState(order.statusUpdatedAt);
  const [baseline, setBaseline] = useState({
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    statusNote: order.statusNote ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setOrderStatus(order.orderStatus);
    setPaymentStatus(order.paymentStatus);
    setStatusNote(order.statusNote ?? "");
    setStatusUpdatedAt(order.statusUpdatedAt);
    setBaseline({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      statusNote: order.statusNote ?? "",
    });
  }, [order]);

  const dirty =
    orderStatus !== baseline.orderStatus ||
    paymentStatus !== baseline.paymentStatus ||
    statusNote.trim() !== baseline.statusNote.trim();

  async function saveChanges() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          statusNote,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not update order.");
        return;
      }
      setStatusUpdatedAt(data.statusUpdatedAt ?? new Date().toISOString());
      setBaseline({
        orderStatus: data.orderStatus ?? orderStatus,
        paymentStatus: data.paymentStatus ?? paymentStatus,
        statusNote: (data.statusNote as string | null) ?? statusNote.trim(),
      });
      setMessage("Order updated. Track Order now shows the new status.");
      router.refresh();
    } catch {
      setError("Could not update order.");
    } finally {
      setSaving(false);
    }
  }

  async function copyOrderId() {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  const whatsappHref = buildWhatsAppUrl(
    buildOrderStatusMessage(
      order.firstName,
      order.orderNumber,
      orderStatusLabel(orderStatus)
    )
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/orders"
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          <ArrowLeft className="h-4 w-4" />
          All orders
        </Link>
      </div>

      <AdminPanel className="overflow-visible p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-mono text-lg font-bold text-ink sm:text-xl">
                {order.orderNumber}
              </h1>
              <button
                type="button"
                onClick={() => void copyOrderId()}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-canvas px-2 text-xs font-semibold text-ink-muted hover:bg-brand-tint hover:text-brand"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy ID"}
              </button>
            </div>
            <p className="text-sm text-muted">
              Placed{" "}
              {new Date(order.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={orderStatusBadgeVariant(orderStatus)}>
                {orderStatusLabel(orderStatus)}
              </Badge>
              <Badge variant={paymentStatusBadgeVariant(paymentStatus)}>
                {paymentStatusLabel(paymentStatus)}
              </Badge>
              <Badge variant="muted">
                {order.fulfillmentType === "DELIVERY"
                  ? order.deliveryTown
                    ? `Delivery · ${order.deliveryTown}`
                    : "Delivery"
                  : "Store Pickup"}
              </Badge>
            </div>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp customer
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
        </div>
      </AdminPanel>

      <AdminPanel className="overflow-visible p-4 sm:p-5">
        <h2 className="mb-4 text-sm font-bold text-brand">Fulfillment progress</h2>
        <OrderStatusTimeline status={orderStatus} />
        {statusUpdatedAt ? (
          <p className="mt-3 text-xs text-muted">
            Status updated{" "}
            {new Date(statusUpdatedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        ) : null}
      </AdminPanel>

      <div className="grid gap-4 lg:grid-cols-5">
        <AdminPanel className="overflow-visible p-4 sm:p-5 lg:col-span-3">
          <h2 className="mb-4 text-sm font-bold text-brand">Update order</h2>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Order status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ORDER_STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setOrderStatus(status)}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
                      orderStatus === status
                        ? "bg-brand text-white"
                        : "bg-surface-muted text-ink-muted hover:bg-brand-tint hover:text-brand"
                    )}
                  >
                    {ORDER_STATUS_LABELS[status as OrderStatusValue]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Payment
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PAYMENT_STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setPaymentStatus(status)}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
                      paymentStatus === status
                        ? "bg-ink text-white"
                        : "bg-surface-muted text-ink-muted hover:bg-brand-tint hover:text-brand"
                    )}
                  >
                    {PAYMENT_STATUS_LABELS[status as PaymentStatusValue]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="statusNote"
                className="text-xs font-semibold uppercase tracking-wide text-ink-muted"
              >
                Note for customer (optional)
              </label>
              <Input
                id="statusNote"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. Left Nairobi hub this morning"
                maxLength={280}
              />
              <p className="text-xs text-muted">
                Shown on the Track Order page when the customer looks up this order.
              </p>
            </div>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {message}
              </p>
            ) : null}

            <Button
              type="button"
              onClick={() => void saveChanges()}
              disabled={saving || !dirty}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Save changes
            </Button>
          </div>
        </AdminPanel>

        <AdminPanel className="overflow-visible p-4 sm:p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold text-brand">Customer</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Name
              </dt>
              <dd className="mt-0.5 font-medium text-ink">
                {order.firstName} {order.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Email
              </dt>
              <dd className="mt-0.5 break-all text-ink">{order.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Phone
              </dt>
              <dd className="mt-0.5 text-ink">{order.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Fulfillment
              </dt>
              <dd className="mt-0.5 text-ink">
                {order.fulfillmentType === "DELIVERY"
                  ? `Delivery${order.deliveryTown ? ` to ${order.deliveryTown}` : ""}`
                  : "Store pickup"}
              </dd>
            </div>
          </dl>
        </AdminPanel>
      </div>

      <AdminPanel className="overflow-visible">
        <div className="border-b border-border px-4 py-3 sm:px-5">
          <h2 className="text-sm font-bold text-brand">Items</h2>
        </div>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 sm:px-5"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
                {item.product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                    No img
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{item.title}</p>
                <p className="text-xs text-muted">
                  {item.product.brand} · Qty {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-ink">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="space-y-1.5 border-t border-border bg-surface/50 px-4 py-4 sm:px-5">
          <div className="flex justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted">
            <span>Shipping</span>
            <span>{formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-ink">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </AdminPanel>
    </div>
  );
}
