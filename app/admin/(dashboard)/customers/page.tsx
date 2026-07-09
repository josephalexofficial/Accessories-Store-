import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: { where: { paymentStatus: "PAID" } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Customer Management</h1>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-card">
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-4">Customer ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Lifetime Spend</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const spend = customer.orders.reduce(
                  (sum, o) => sum + Number(o.total),
                  0
                );
                return (
                  <tr key={customer.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-mono text-xs">{customer.id.slice(0, 8)}</td>
                    <td className="p-4">{customer.firstName} {customer.lastName}</td>
                    <td className="p-4 text-muted">{customer.email}</td>
                    <td className="p-4 text-muted">{customer.phone}</td>
                    <td className="p-4">{customer.orders.length}</td>
                    <td className="p-4 font-medium">{formatPrice(spend)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
