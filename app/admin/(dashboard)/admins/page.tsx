import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { AdminPasswordForm } from "@/components/admin/password-form";
import { AddAdminForm } from "@/components/admin/add-admin-form";
import {
  AdminPageHeader,
  AdminPanel,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-ui";

export default async function AdminTeamPage() {
  const session = await auth();
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, createdAt: true },
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Admin Team Management" />

      <AdminPanel>
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderCell>Admin Email</AdminTableHeaderCell>
            <AdminTableHeaderCell>Date Added</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
          </AdminTableHead>
          <AdminTableBody>
            {admins.map((admin) => (
              <AdminTableRow key={admin.id}>
                <AdminTableCell>{admin.email}</AdminTableCell>
                <AdminTableCell className="text-muted">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </AdminTableCell>
                <AdminTableCell>
                  <Badge variant="success">Active</Badge>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </AdminPanel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AddAdminForm />
        {session?.user?.email && (
          <AdminPasswordForm email={session.user.email} />
        )}
      </div>
    </div>
  );
}
