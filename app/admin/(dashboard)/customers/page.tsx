import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
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

export default async function AdminCustomersPage() {
  const [customers, orderStats] = await Promise.all([
    prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
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

  const statsByCustomer = new Map(
    orderStats.map((stat) => [
      stat.customerId!,
      {
        orderCount: stat._count._all,
        spend: Number(stat._sum.total ?? 0),
      },
    ])
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Customer Management" />

      <AdminPanel>
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderCell>Customer ID</AdminTableHeaderCell>
            <AdminTableHeaderCell>Name</AdminTableHeaderCell>
            <AdminTableHeaderCell>Email</AdminTableHeaderCell>
            <AdminTableHeaderCell>Phone</AdminTableHeaderCell>
            <AdminTableHeaderCell>Orders</AdminTableHeaderCell>
            <AdminTableHeaderCell>Lifetime Spend</AdminTableHeaderCell>
          </AdminTableHead>
          <AdminTableBody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <AdminEmptyState>No customers yet.</AdminEmptyState>
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const stats = statsByCustomer.get(customer.id);
                return (
                  <AdminTableRow key={customer.id}>
                    <AdminTableCell className="font-mono text-xs">
                      {customer.id.slice(0, 8)}
                    </AdminTableCell>
                    <AdminTableCell>
                      {customer.firstName} {customer.lastName}
                    </AdminTableCell>
                    <AdminTableCell className="text-muted">
                      {customer.email}
                    </AdminTableCell>
                    <AdminTableCell className="text-muted">
                      {customer.phone}
                    </AdminTableCell>
                    <AdminTableCell>{stats?.orderCount ?? 0}</AdminTableCell>
                    <AdminTableCell className="font-medium">
                      {formatPrice(stats?.spend ?? 0)}
                    </AdminTableCell>
                  </AdminTableRow>
                );
              })
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminPanel>
    </div>
  );
}
