import { notFound } from "next/navigation";
import { getAdminOrderById } from "@/lib/admin-queries";
import { toIsoString, toIsoStringRequired } from "@/lib/date";
import { AdminOrderDetail } from "@/components/admin/admin-order-detail";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) notFound();

  return (
    <AdminOrderDetail
      order={{
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: toIsoStringRequired(order.createdAt),
        updatedAt: toIsoStringRequired(order.updatedAt),
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        phone: order.phone,
        fulfillmentType: order.fulfillmentType,
        deliveryTown: order.deliveryTown,
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping),
        total: Number(order.total),
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        statusNote: order.statusNote,
        statusUpdatedAt: toIsoString(order.statusUpdatedAt),
        items: order.items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: Number(item.price),
          product: {
            id: item.product.id,
            slug: item.product.slug,
            imageUrl: item.product.imageUrl,
            brand: item.product.brand,
          },
        })),
      }}
    />
  );
}
