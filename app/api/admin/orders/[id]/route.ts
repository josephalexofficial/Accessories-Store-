import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import {
  isOrderStatus,
  isPaymentStatus,
} from "@/lib/order-status";

function bustOrderCaches() {
  revalidateTag("admin-orders", "max");
  revalidateTag("admin-dashboard", "max");
  revalidateTag("admin-customers", "max");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const data: {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    statusNote?: string | null;
    statusUpdatedAt?: Date;
  } = {};

  if (body.orderStatus !== undefined) {
    const next = String(body.orderStatus);
    if (!isOrderStatus(next)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }
    data.orderStatus = next;
    data.statusUpdatedAt = new Date();
  }

  if (body.paymentStatus !== undefined) {
    const next = String(body.paymentStatus);
    if (!isPaymentStatus(next)) {
      return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
    }
    data.paymentStatus = next;
  }

  if (body.statusNote !== undefined) {
    const note = String(body.statusNote ?? "").trim();
    data.statusNote = note.length > 0 ? note.slice(0, 280) : null;
    if (!data.statusUpdatedAt) data.statusUpdatedAt = new Date();
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data,
      select: {
        id: true,
        orderNumber: true,
        orderStatus: true,
        paymentStatus: true,
        statusNote: true,
        statusUpdatedAt: true,
      },
    });

    bustOrderCaches();

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      statusNote: order.statusNote,
      statusUpdatedAt: order.statusUpdatedAt?.toISOString() ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}
