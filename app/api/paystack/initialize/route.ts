import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildPaystackReference,
  getPaystackCallbackUrl,
  initializePaystackTransaction,
} from "@/lib/paystack";

/**
 * Start Paystack checkout for an existing PENDING order.
 * Used right after Place Order & Pay creates the order.
 *
 * Body: { orderNumber: string, email: string }
 * Returns: { authorizationUrl, reference, orderNumber }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const orderNumber = String(body.orderNumber ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        email: { equals: email, mode: "insensitive" },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        {
          error: "This order is already paid",
          orderNumber: order.orderNumber,
          alreadyPaid: true,
        },
        { status: 409 }
      );
    }

    // New reference per attempt so customers can retry after a failed/cancelled payment
    const reference = buildPaystackReference(order.orderNumber);

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paystackReference: reference,
        paymentStatus: "PENDING",
      },
    });

    const paystack = await initializePaystackTransaction({
      email: order.email,
      amountKes: Number(order.total),
      reference,
      callbackUrl: getPaystackCallbackUrl(request.url),
      orderNumber: order.orderNumber,
      customerName: `${order.firstName} ${order.lastName}`,
    });

    return NextResponse.json({
      authorizationUrl: paystack.authorization_url,
      reference: paystack.reference,
      orderNumber: order.orderNumber,
      // Helps you confirm which mode the server is using
      mode: process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_live_")
        ? "live"
        : "test",
    });
  } catch (error) {
    console.error("Paystack initialize failed:", error);
    const message =
      error instanceof Error ? error.message : "Could not start payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
