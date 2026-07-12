import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findDeliveryLocationById } from "@/lib/delivery-locations";

type OrderItemInput = {
  productId: string;
  quantity: number;
  price: number;
  title: string;
};

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `WH-${stamp}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      fulfillmentType,
      deliveryLocationId,
      items,
    } = body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      fulfillmentType?: "DELIVERY" | "PICKUP";
      deliveryLocationId?: string;
      items?: OrderItemInput[];
    };

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Please fill in all billing details." },
        { status: 400 }
      );
    }

    if (fulfillmentType !== "DELIVERY" && fulfillmentType !== "PICKUP") {
      return NextResponse.json(
        { error: "Invalid fulfillment type." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (
        !item.productId ||
        !item.title ||
        !Number.isFinite(item.quantity) ||
        item.quantity < 1 ||
        !Number.isFinite(item.price)
      ) {
        return NextResponse.json(
          { error: "Invalid cart items." },
          { status: 400 }
        );
      }
    }

    let shipping = 0;
    let deliveryTown: string | null = null;

    if (fulfillmentType === "DELIVERY") {
      if (!deliveryLocationId) {
        return NextResponse.json(
          { error: "Please select a delivery location." },
          { status: 400 }
        );
      }

      const location = await findDeliveryLocationById(deliveryLocationId);
      if (!location) {
        return NextResponse.json(
          { error: "Selected delivery location is not available." },
          { status: 400 }
        );
      }

      shipping = location.fee;
      deliveryTown = location.name;
    }

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    const validIds = new Set(products.map((product) => product.id));
    if (productIds.some((id) => !validIds.has(id))) {
      return NextResponse.json(
        { error: "One or more products are no longer available." },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    const total = subtotal + shipping;

    const customer = await prisma.customer.upsert({
      where: { email: email.toLowerCase().trim() },
      create: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        preferredFulfillment: fulfillmentType,
        deliveryTown,
      },
      update: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        preferredFulfillment: fulfillmentType,
        deliveryTown,
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        fulfillmentType,
        deliveryTown,
        subtotal,
        shipping,
        total,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            title: item.title,
          })),
        },
      },
    });

    const { notifyNewOrder } = await import("@/lib/admin-notifications");
    await notifyNewOrder({
      orderNumber: order.orderNumber,
      firstName: order.firstName,
      lastName: order.lastName,
      total: Number(order.total),
    });

    return NextResponse.json(
      { orderNumber: order.orderNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order failed:", error);
    return NextResponse.json(
      { error: "Could not place order. Please try again." },
      { status: 500 }
    );
  }
}
