"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageCircle,
  Users,
  Shield,
  MapPin,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/whatsapp", label: "WhatsApp Log", icon: MessageCircle },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/admins", label: "Admins", icon: Shield },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  logoutAction,
}: {
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar fixed inset-y-0 left-0 z-40 hidden w-64 flex-col md:flex">
      <div className="border-b border-white/15 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white">
          W
        </div>
        <p className="mt-4 text-sm font-bold tracking-widest text-white">WHIMSEY</p>
        <p className="text-xs text-white/70">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white text-brand shadow-sm"
                  : "text-white/85 hover:bg-white/12 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="border-t border-white/15 p-4">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/12 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </form>
    </aside>
  );
}

export function AdminMobileChrome() {
  const pathname = usePathname();

  return (
    <div className="admin-mobile-chrome sticky top-0 z-50 border-b border-border bg-white shadow-sm md:hidden">
      <div className="px-4 py-3">
        <p className="text-sm font-bold tracking-widest text-brand">WHIMSEY ADMIN</p>
      </div>
      <div className="border-t border-border/80">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-3 py-2.5">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  active
                    ? "bg-brand text-white"
                    : "bg-surface text-ink-muted hover:text-brand"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
