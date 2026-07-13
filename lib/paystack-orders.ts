import "server-only";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyPaystackTransaction } from "@/lib/paystack";

function bustOrderCaches() {
  revalidateTag("admin-orders", "max");
  revalidateTag("admin-dashboard", "max");
  revalidateTag("admin-customers", "max");
}

/**
 * Confirm a Paystack charge and mark the matching order as PAID.
 * Safe to call from callback verify OR webhook (idempotent).
 */
export async function markOrderPaidFromPaystack(reference: string) {
  const verified = await verifyPaystackTransaction(reference);

  if (verified.status !== "success") {
    return {
      ok: false as const,
      reason: "not_success" as const,
      status: verified.status,
      orderNumber: null as string | null,
    };
  }

  const metaOrderNumber =
    typeof verified.metadata?.orderNumber === "string"
      ? verified.metadata.orderNumber
      : null;

  const target =
    (await prisma.order.findFirst({
      where: { paystackReference: reference },
      select: {
        id: true,
        orderNumber: true,
        paymentStatus: true,
        total: true,
      },
    })) ??
    (metaOrderNumber
      ? await prisma.order.findUnique({
          where: { orderNumber: metaOrderNumber },
          select: {
            id: true,
            orderNumber: true,
            paymentStatus: true,
            total: true,
          },
        })
      : null);

  if (!target) {
    return {
      ok: false as const,
      reason: "order_not_found" as const,
      status: verified.status,
      orderNumber: null,
    };
  }

  // Amount check (Paystack amount is in the smallest currency unit)
  const expectedKobo = Math.round(Number(target.total) * 100);
  if (verified.amount !== expectedKobo) {
    console.error("Paystack amount mismatch", {
      reference,
      expectedKobo,
      got: verified.amount,
      orderNumber: target.orderNumber,
    });
    return {
      ok: false as const,
      reason: "amount_mismatch" as const,
      status: verified.status,
      orderNumber: target.orderNumber,
    };
  }

  if (target.paymentStatus === "PAID") {
    return {
      ok: true as const,
      alreadyPaid: true as const,
      orderNumber: target.orderNumber,
    };
  }

  await prisma.order.update({
    where: { id: target.id },
    data: {
      paymentStatus: "PAID",
      paidAt: verified.paid_at ? new Date(verified.paid_at) : new Date(),
      paystackReference: reference,
    },
  });

  bustOrderCaches();

  return {
    ok: true as const,
    alreadyPaid: false as const,
    orderNumber: target.orderNumber,
  };
}

export async function markOrderPaymentFailed(reference: string) {
  const order = await prisma.order.findFirst({
    where: { paystackReference: reference },
    select: { id: true, paymentStatus: true, orderNumber: true },
  });

  if (!order || order.paymentStatus === "PAID") {
    return order?.orderNumber ?? null;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "FAILED" },
  });

  bustOrderCaches();
  return order.orderNumber;
}
