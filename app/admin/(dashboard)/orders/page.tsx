import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
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
      <h1 className="text-2xl font-bold text-foreground">Orders & Fulfillment</h1>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-card">
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-4">Order ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Fulfillment</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-mono text-xs">{order.orderNumber}</td>
                  <td className="p-4 text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">{order.firstName} {order.lastName}</td>
                  <td className="p-4">
                    <Badge variant="muted">
                      {order.fulfillmentType === "DELIVERY" ? "Fargo Delivery" : "Store Pickup"}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium">{formatPrice(Number(order.total))}</td>
                  <td className="p-4">
                    <Badge variant={order.paymentStatus === "PAID" ? "success" : "muted"}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={statusVariant(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
