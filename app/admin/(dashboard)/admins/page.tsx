import { AdminPasswordForm } from "@/components/admin/password-form";
import { AddAdminForm } from "@/components/admin/add-admin-form";
import { AdminTeamRow } from "@/components/admin/admin-team-row";
import {
  AdminPageHeader,
  AdminPanel,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableHeaderCell,
} from "@/components/admin/admin-ui";
import { getAdminSession, getAdminTeam } from "@/lib/admin-queries";
import { isSuperAdmin, SUPER_ADMIN_EMAIL } from "@/lib/super-admin";

export default async function AdminTeamPage() {
  const [session, admins] = await Promise.all([
    getAdminSession(),
    getAdminTeam(),
  ]);
  const canManageAdmins = isSuperAdmin(session?.user?.email);

  return (
    <div className="space-y-5 sm:space-y-8">
      <AdminPageHeader title="Admin Team Management" />

      <AdminPanel>
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderCell>Admin Email</AdminTableHeaderCell>
            <AdminTableHeaderCell>Role</AdminTableHeaderCell>
            <AdminTableHeaderCell>Date Added</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
          </AdminTableHead>
          <AdminTableBody>
            {admins.map((admin) => (
              <AdminTeamRow
                key={admin.id}
                admin={admin}
                canManage={canManageAdmins}
              />
            ))}
          </AdminTableBody>
        </AdminTable>
      </AdminPanel>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {canManageAdmins ? (
          <AddAdminForm />
        ) : (
          <AdminPanel>
            <div className="p-4 sm:p-6">
              <h2 className="text-base font-semibold text-foreground">
                Add New Admin
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Only the super admin ({SUPER_ADMIN_EMAIL}) can create or remove
                admin accounts. You can still update your own password on this
                page.
              </p>
            </div>
          </AdminPanel>
        )}
        {session?.user?.email && (
          <AdminPasswordForm email={session.user.email} />
        )}
      </div>
    </div>
  );
}
