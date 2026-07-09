import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { AdminPasswordForm } from "@/components/admin/password-form";
import { AddAdminForm } from "@/components/admin/add-admin-form";

export default async function AdminTeamPage() {
  const session = await auth();
  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Admin Team Management</h1>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-card">
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-4">Admin Email</th>
              <th className="p-4">Date Added</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-border last:border-0">
                <td className="p-4">{admin.email}</td>
                <td className="p-4 text-muted">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Badge variant="success">Active</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AddAdminForm />
        {session?.user?.email && (
          <AdminPasswordForm email={session.user.email} />
        )}
      </div>
    </div>
  );
}
