import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { orderNumber, email } = await req.json();

  if (!orderNumber || !email) {
    return NextResponse.json({ error: "Order ID and email required" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      email: { equals: email, mode: "insensitive" },
    },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.orderStatus,
    paymentStatus: order.paymentStatus,
    total: Number(order.total),
    fulfillmentType: order.fulfillmentType,
    deliveryTown: order.deliveryTown,
    createdAt: order.createdAt,
    items: order.items.map((i) => ({
      title: i.title,
      quantity: i.quantity,
      price: Number(i.price),
    })),
  });
}
