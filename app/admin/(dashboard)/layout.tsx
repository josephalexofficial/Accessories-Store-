import Link from "next/link";
import { auth, signOut } from "@/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageCircle,
  Users,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/whatsapp", label: "WhatsApp Log", icon: MessageCircle },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/admins", label: "Admins", icon: Shield },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-black">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border p-6">
          <p className="text-sm font-bold tracking-widest text-white">
            WHIMSEY
          </p>
          <p className="text-xs text-muted">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-all duration-200 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin" });
          }}
          className="border-t border-border p-4"
        >
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </aside>
      <main className="flex-1 md:ml-64">
        <div className="border-b border-border p-4 md:hidden">
          <p className="text-sm font-bold tracking-widest">WHIMSEY ADMIN</p>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
