import { getAdminOrders } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminOrdersList } from "@/components/admin/admin-orders-list";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminPageHeader title="Orders & Fulfillment" />
      <AdminOrdersList
        orders={orders.map((order) => ({
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
          itemCount: order._count.items,
        }))}
      />
    </div>
  );
}
