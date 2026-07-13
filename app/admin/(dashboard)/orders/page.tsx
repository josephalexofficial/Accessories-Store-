import { getAdminOrders } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminOrdersList } from "@/components/admin/admin-orders-list";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminPageHeader title="Orders & Fulfillment" />
      <AdminOrdersList orders={orders} />
    </div>
  );
}
