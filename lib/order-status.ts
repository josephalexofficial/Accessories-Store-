export const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

/** Happy-path fulfillment steps shown on track + admin timelines */
export const ORDER_TIMELINE_STEPS = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
] as const satisfies readonly OrderStatusValue[];

export const ORDER_STATUS_LABELS: Record<OrderStatusValue, string> = {
  PENDING: "Order received",
  PROCESSING: "Preparing",
  SHIPPED: "On transit",
  COMPLETED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatusValue, string> = {
  PENDING: "We’ve received your order and will start preparing it soon.",
  PROCESSING: "Your order is being prepared.",
  SHIPPED: "Your order is on the way.",
  COMPLETED: "Your order has been delivered or picked up.",
  CANCELLED: "This order was cancelled.",
};

export const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"] as const;
export type PaymentStatusValue = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatusValue, string> = {
  PENDING: "Payment pending",
  PAID: "Paid",
  FAILED: "Payment failed",
};

export function isOrderStatus(value: string): value is OrderStatusValue {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function isPaymentStatus(value: string): value is PaymentStatusValue {
  return (PAYMENT_STATUSES as readonly string[]).includes(value);
}

export function orderStatusLabel(status: string): string {
  if (isOrderStatus(status)) return ORDER_STATUS_LABELS[status];
  return status;
}

export function paymentStatusLabel(status: string): string {
  if (isPaymentStatus(status)) return PAYMENT_STATUS_LABELS[status];
  return status;
}

export function orderStatusBadgeVariant(
  status: string
): "success" | "warning" | "muted" | "default" | "danger" {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "PROCESSING":
      return "default";
    case "SHIPPED":
      return "warning";
    case "CANCELLED":
      return "danger";
    default:
      return "muted";
  }
}

export function paymentStatusBadgeVariant(
  status: string
): "success" | "warning" | "muted" | "danger" {
  switch (status) {
    case "PAID":
      return "success";
    case "FAILED":
      return "danger";
    default:
      return "muted";
  }
}

export function timelineStepState(
  current: string,
  step: (typeof ORDER_TIMELINE_STEPS)[number]
): "complete" | "current" | "upcoming" | "cancelled" {
  if (current === "CANCELLED") return "cancelled";
  const currentIndex = ORDER_TIMELINE_STEPS.indexOf(
    current as (typeof ORDER_TIMELINE_STEPS)[number]
  );
  const stepIndex = ORDER_TIMELINE_STEPS.indexOf(step);
  if (currentIndex < 0) return "upcoming";
  if (stepIndex < currentIndex) return "complete";
  if (stepIndex === currentIndex) return "current";
  return "upcoming";
}
