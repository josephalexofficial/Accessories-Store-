import { signOut } from "@/auth";
import { getAdminSession } from "@/lib/admin-queries";
import { AdminMobileChrome, AdminSidebar } from "@/components/admin/admin-nav";

async function logout() {
  "use server";
  await signOut({ redirectTo: "/admin" });
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell flex min-h-screen">
      <AdminSidebar logoutAction={logout} />
      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <AdminMobileChrome logoutAction={logout} />
        <main className="flex-1 px-3 pb-8 pt-0 sm:px-4 sm:pb-6 md:px-8 md:pb-8 md:pt-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
