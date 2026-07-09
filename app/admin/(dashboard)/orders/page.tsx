import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-ui";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
      firstName: true,
      lastName: true,
      fulfillmentType: true,
      total: true,
      paymentStatus: true,
      orderStatus: true,
    },
  });

  const statusVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success" as const;
      case "PROCESSING":
      case "SHIPPED":
        return "warning" as const;
      default:
        return "muted" as const;
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Orders & Fulfillment" />

      <AdminPanel>
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderCell>Order ID</AdminTableHeaderCell>
            <AdminTableHeaderCell>Date</AdminTableHeaderCell>
            <AdminTableHeaderCell>Customer</AdminTableHeaderCell>
            <AdminTableHeaderCell>Fulfillment</AdminTableHeaderCell>
            <AdminTableHeaderCell>Total</AdminTableHeaderCell>
            <AdminTableHeaderCell>Payment</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
          </AdminTableHead>
          <AdminTableBody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <AdminEmptyState>No orders yet.</AdminEmptyState>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <AdminTableRow key={order.id}>
                  <AdminTableCell className="font-mono text-xs">
                    {order.orderNumber}
                  </AdminTableCell>
                  <AdminTableCell className="text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </AdminTableCell>
                  <AdminTableCell>
                    {order.firstName} {order.lastName}
                  </AdminTableCell>
                  <AdminTableCell>
                    <Badge variant="muted">
                      {order.fulfillmentType === "DELIVERY"
                        ? "Fargo Delivery"
                        : "Store Pickup"}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell className="font-medium">
                    {formatPrice(Number(order.total))}
                  </AdminTableCell>
                  <AdminTableCell>
                    <Badge
                      variant={order.paymentStatus === "PAID" ? "success" : "muted"}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={statusVariant(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </AdminTableCell>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminPanel>
    </div>
  );
}
