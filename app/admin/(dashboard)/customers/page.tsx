import { formatPrice } from "@/lib/utils";
import { getAdminCustomers } from "@/lib/admin-queries";
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
  const { customers, orderStats } = await getAdminCustomers();

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
    <div className="space-y-4 sm:space-y-6">
      <AdminPageHeader title="Customer Management" />

      {customers.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState>No customers yet.</AdminEmptyState>
        </AdminPanel>
      ) : (
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
              {customers.map((customer) => {
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
              })}
            </AdminTableBody>
          </AdminTable>
        </AdminPanel>
      )}
    </div>
  );
}
