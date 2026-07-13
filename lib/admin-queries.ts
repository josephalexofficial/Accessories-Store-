import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Deduplicate auth() within a single request (layout + page). */
export const getAdminSession = cache(async () => auth());

const ADMIN_CACHE_SECONDS = 30;

export const getAdminDashboardData = unstable_cache(
  async () => {
    const [recentOrders, productCount, whatsappClicks, paidRevenue, totalOrders] =
      await Promise.all([
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            orderNumber: true,
            total: true,
            paymentStatus: true,
          },
        }),
        prisma.product.count(),
        prisma.whatsAppClick.count(),
        prisma.order.aggregate({
          where: { paymentStatus: "PAID" },
          _sum: { total: true },
        }),
        prisma.order.count(),
      ]);

    return {
      recentOrders,
      productCount,
      whatsappClicks,
      totalRevenue: Number(paidRevenue._sum.total ?? 0),
      totalOrders,
    };
  },
  ["admin-dashboard"],
  { revalidate: ADMIN_CACHE_SECONDS, tags: ["admin-dashboard", "admin-orders"] }
);

export const getAdminProductList = unstable_cache(
  async () =>
    prisma.product.findMany({
      orderBy: [{ category: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        brand: true,
        category: true,
        price: true,
        salePrice: true,
        isSale: true,
        stockStatus: true,
      },
    }),
  ["admin-products"],
  { revalidate: ADMIN_CACHE_SECONDS, tags: ["admin-products", "products"] }
);

export const getAdminProductById = cache(async (id: string) =>
  prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      brand: true,
      slug: true,
      category: true,
      price: true,
      salePrice: true,
      isSale: true,
      stockStatus: true,
      imageUrl: true,
      specType: true,
      specifications: true,
    },
  })
);

export const getAdminOrders = unstable_cache(
  async () => {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 150,
      select: {
        id: true,
        orderNumber: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        fulfillmentType: true,
        deliveryTown: true,
        total: true,
        paymentStatus: true,
        orderStatus: true,
        statusUpdatedAt: true,
        _count: { select: { items: true } },
      },
    });

    // Serialize before caching — unstable_cache JSON would turn Date into string anyway
    // and callers calling `.toISOString()` would crash on cache hits.
    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone,
      fulfillmentType: order.fulfillmentType,
      deliveryTown: order.deliveryTown,
      total: Number(order.total),
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      statusUpdatedAt: order.statusUpdatedAt?.toISOString() ?? null,
      itemCount: order._count.items,
    }));
  },
  ["admin-orders"],
  { revalidate: 20, tags: ["admin-orders"] }
);

export const getAdminOrderById = cache(async (id: string) =>
  prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              imageUrl: true,
              brand: true,
            },
          },
        },
      },
    },
  })
);

export const getAdminCustomers = unstable_cache(
  async () => {
    const [customers, orderStats] = await Promise.all([
      prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      }),
      prisma.order.groupBy({
        by: ["customerId"],
        where: {
          paymentStatus: "PAID",
          customerId: { not: null },
        },
        _sum: { total: true },
        _count: { _all: true },
      }),
    ]);

    return { customers, orderStats };
  },
  ["admin-customers"],
  { revalidate: ADMIN_CACHE_SECONDS, tags: ["admin-customers", "admin-orders"] }
);

export const getAdminWhatsAppData = unstable_cache(
  async () => {
    const [clicks, topProducts, totalClicks] = await Promise.all([
      prisma.whatsAppClick.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { product: { select: { title: true } } },
      }),
      prisma.product.findMany({
        orderBy: { popularity: "desc" },
        take: 10,
        select: { id: true, title: true, popularity: true },
      }),
      prisma.whatsAppClick.count(),
    ]);

    return { clicks, topProducts, totalClicks };
  },
  ["admin-whatsapp"],
  { revalidate: 20, tags: ["admin-whatsapp"] }
);

export const getAdminTeam = unstable_cache(
  async () =>
    prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, createdAt: true },
    }),
  ["admin-team"],
  { revalidate: 60, tags: ["admin-team"] }
);
