import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  orderStatusLabel,
  paymentStatusLabel,
  ORDER_STATUS_DESCRIPTIONS,
  isOrderStatus,
} from "@/lib/order-status";

async function findTrackedOrder(orderNumber: string, email: string) {
  return prisma.order.findFirst({
    where: {
      orderNumber: orderNumber.trim(),
      email: { equals: email.trim(), mode: "insensitive" },
    },
    include: {
      items: {
        select: {
          title: true,
          quantity: true,
          price: true,
        },
      },
    },
  });
}

function trackPayload(order: NonNullable<Awaited<ReturnType<typeof findTrackedOrder>>>) {
  const status = order.orderStatus;
  return {
    orderNumber: order.orderNumber,
    status,
    orderStatus: status,
    statusLabel: orderStatusLabel(status),
    statusDescription: isOrderStatus(status)
      ? ORDER_STATUS_DESCRIPTIONS[status]
      : "",
    statusNote: order.statusNote,
    statusUpdatedAt: order.statusUpdatedAt?.toISOString() ?? null,
    paymentStatus: order.paymentStatus,
    paymentStatusLabel: paymentStatusLabel(order.paymentStatus),
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    fulfillmentType: order.fulfillmentType,
    deliveryTown: order.deliveryTown,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({
      title: i.title,
      quantity: i.quantity,
      price: Number(i.price),
    })),
  };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const orderNumber = String(body.orderNumber ?? "").trim();
  const email = String(body.email ?? "").trim();

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Order ID and email required" },
      { status: 400 }
    );
  }

  const order = await findTrackedOrder(orderNumber, email);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(trackPayload(order));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = String(searchParams.get("orderNumber") ?? "").trim();
  const email = String(searchParams.get("email") ?? "").trim();

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Order ID and email required" },
      { status: 400 }
    );
  }

  const order = await findTrackedOrder(orderNumber, email);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(trackPayload(order));
}
