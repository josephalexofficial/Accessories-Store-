"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AdminEmptyState,
  AdminPanel,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-ui";
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
import { cn } from "@/lib/utils";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  createdAt: string | Date;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fulfillmentType: "DELIVERY" | "PICKUP";
  deliveryTown: string | null;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  itemCount: number;
};

const STATUS_FILTERS: Array<"ALL" | OrderStatusValue> = [
  "ALL",
  ...ORDER_STATUSES,
];

export function AdminOrdersList({ orders }: { orders: AdminOrderListItem[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatusValue>(
    "ALL"
  );
  const [paymentFilter, setPaymentFilter] = useState<"ALL" | PaymentStatusValue>(
    "ALL"
  );
  const [fulfillmentFilter, setFulfillmentFilter] = useState<
    "ALL" | "DELIVERY" | "PICKUP"
  >("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "ALL" && order.orderStatus !== statusFilter) {
        return false;
      }
      if (paymentFilter !== "ALL" && order.paymentStatus !== paymentFilter) {
        return false;
      }
      if (
        fulfillmentFilter !== "ALL" &&
        order.fulfillmentType !== fulfillmentFilter
      ) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        order.orderNumber,
        order.firstName,
        order.lastName,
        order.email,
        order.phone,
        order.deliveryTown ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [orders, query, statusFilter, paymentFilter, fulfillmentFilter]);

  return (
    <div className="space-y-4">
      <AdminPanel className="overflow-visible p-3 sm:p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID, name, email, phone…"
            className="pl-9"
            aria-label="Search orders"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
                statusFilter === status
                  ? "bg-brand text-white"
                  : "bg-surface-muted text-ink-muted hover:bg-brand-tint hover:text-brand"
              )}
            >
              {status === "ALL" ? "All statuses" : ORDER_STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <FilterChip
            active={paymentFilter === "ALL"}
            onClick={() => setPaymentFilter("ALL")}
            label="All payments"
          />
          {PAYMENT_STATUSES.map((status) => (
            <FilterChip
              key={status}
              active={paymentFilter === status}
              onClick={() => setPaymentFilter(status)}
              label={PAYMENT_STATUS_LABELS[status]}
            />
          ))}
          <span className="mx-1 hidden h-5 w-px bg-border sm:inline-block" />
          <FilterChip
            active={fulfillmentFilter === "ALL"}
            onClick={() => setFulfillmentFilter("ALL")}
            label="All types"
          />
          <FilterChip
            active={fulfillmentFilter === "DELIVERY"}
            onClick={() => setFulfillmentFilter("DELIVERY")}
            label="Delivery"
          />
          <FilterChip
            active={fulfillmentFilter === "PICKUP"}
            onClick={() => setFulfillmentFilter("PICKUP")}
            label="Pickup"
          />
        </div>
      </AdminPanel>

      {orders.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>No orders yet.</AdminEmptyState>
        </AdminPanel>
      ) : filtered.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>No orders match your filters.</AdminEmptyState>
        </AdminPanel>
      ) : (
        <AdminPanel>
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>Order ID</AdminTableHeaderCell>
              <AdminTableHeaderCell>Date</AdminTableHeaderCell>
              <AdminTableHeaderCell>Customer</AdminTableHeaderCell>
              <AdminTableHeaderCell>Fulfillment</AdminTableHeaderCell>
              <AdminTableHeaderCell>Items</AdminTableHeaderCell>
              <AdminTableHeaderCell>Total</AdminTableHeaderCell>
              <AdminTableHeaderCell>Payment</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            </AdminTableHead>
            <AdminTableBody>
              {filtered.map((order) => (
                <AdminTableRow key={order.id}>
                  <AdminTableCell>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      prefetch
                      className="font-mono text-xs font-semibold text-brand hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </AdminTableCell>
                  <AdminTableCell className="whitespace-nowrap text-muted">
                    {new Date(order.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-ink">
                        {order.firstName} {order.lastName}
                      </p>
                      <p className="truncate text-xs text-muted">{order.phone}</p>
                    </div>
                  </AdminTableCell>
                  <AdminTableCell>
                    <Badge variant="muted">
                      {order.fulfillmentType === "DELIVERY"
                        ? order.deliveryTown
                          ? `Delivery · ${order.deliveryTown}`
                          : "Delivery"
                        : "Store Pickup"}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell className="text-muted">
                    {order.itemCount}
                  </AdminTableCell>
                  <AdminTableCell className="font-medium">
                    {formatPrice(order.total)}
                  </AdminTableCell>
                  <AdminTableCell>
                    <Badge
                      variant={paymentStatusBadgeVariant(order.paymentStatus)}
                    >
                      {paymentStatusLabel(order.paymentStatus)}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={orderStatusBadgeVariant(order.orderStatus)}>
                      {orderStatusLabel(order.orderStatus)}
                    </Badge>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
        </AdminPanel>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
        active
          ? "bg-ink text-white"
          : "bg-surface-muted text-ink-muted hover:bg-brand-tint hover:text-brand"
      )}
    >
      {label}
    </button>
  );
}
