"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLinkStatus } from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Shield,
  MapPin,
  LogOut,
  Loader2,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminNotificationBell } from "@/components/admin/admin-notification-bell";
import { WhatsAppBrandIcon } from "@/components/shared/brand-icons";

const NAV: { href: string; label: string; icon: LucideIcon | "whatsapp" }[] = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/whatsapp", label: "WhatsApp Log", icon: "whatsapp" },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/admins", label: "Admins", icon: Shield },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function currentSectionLabel(pathname: string) {
  const match = NAV.find((item) => isActive(pathname, item.href));
  return match?.label ?? "Admin";
}

function NavPendingHint() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <Loader2
      className="ml-auto h-3.5 w-3.5 shrink-0 animate-spin opacity-80"
      aria-hidden
    />
  );
}

function NavIcon({
  icon,
  className,
}: {
  icon: LucideIcon | "whatsapp";
  className?: string;
}) {
  if (icon === "whatsapp") {
    return <WhatsAppBrandIcon className={className} />;
  }
  const Icon = icon;
  return <Icon className={className} />;
}

function AdminNavLink({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon | "whatsapp";
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-white text-brand shadow-sm"
          : "text-white/85 hover:bg-white/12 hover:text-white"
      )}
    >
      <NavIcon icon={icon} className="h-4 w-4" />
      <span className="min-w-0 flex-1">{label}</span>
      <NavPendingHint />
    </Link>
  );
}

function usePrefetchAdminRoutes() {
  const router = useRouter();

  useEffect(() => {
    for (const item of NAV) {
      router.prefetch(item.href);
    }
    router.prefetch("/admin/notifications");
  }, [router]);
}

function SidebarBrand({
  showBell = false,
  onClose,
}: {
  showBell?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className="border-b border-white/15 px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white">
            W
          </div>
          <p className="mt-4 text-sm font-bold tracking-widest text-white">
            WHIMSEY
          </p>
          <p className="text-xs text-white/70">Admin Panel</p>
        </div>
        <div className="flex items-center gap-2">
          {showBell ? <AdminNotificationBell variant="dark" /> : null}
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/15"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-4">
      {NAV.map((item) => (
        <AdminNavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={isActive(pathname, item.href)}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

function SidebarLogout({ logoutAction }: { logoutAction: () => Promise<void> }) {
  return (
    <form action={logoutAction} className="border-t border-white/15 p-4">
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/12 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </form>
  );
}

export function AdminSidebar({
  logoutAction,
}: {
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  usePrefetchAdminRoutes();

  return (
    <aside className="admin-sidebar fixed inset-y-0 left-0 z-40 hidden w-64 flex-col md:flex">
      <SidebarBrand showBell />
      <SidebarNav pathname={pathname} />
      <SidebarLogout logoutAction={logoutAction} />
    </aside>
  );
}

export function AdminMobileChrome({
  logoutAction,
}: {
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  usePrefetchAdminRoutes();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/*
        Fixed (not sticky) + solid opaque fill: table headers / page content
        must never paint through the WHIMSEY ADMIN bar while scrolling.
      */}
      <header
        className="admin-mobile-chrome fixed inset-x-0 top-0 z-50 border-b border-border shadow-[0_1px_0_rgba(15,23,42,0.06)] md:hidden"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="relative z-10 flex items-center gap-2.5 px-3 py-2.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-brand transition-colors hover:bg-brand-tint"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="admin-mobile-drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold tracking-[0.16em] text-brand">
              WHIMSEY ADMIN
            </p>
            <p className="truncate text-sm font-semibold text-ink">
              {currentSectionLabel(pathname)}
            </p>
          </div>

          <AdminNotificationBell variant="light" />
        </div>
      </header>
      {/* Keeps layout height now that the bar is fixed out of document flow */}
      <div
        className="shrink-0 md:hidden"
        style={{ height: "var(--admin-mobile-chrome-height)" }}
        aria-hidden
      />

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Left drawer — same style as desktop sidebar */}
      <aside
        id="admin-mobile-drawer"
        className={cn(
          "admin-sidebar fixed inset-y-0 left-0 z-[70] flex w-[min(18.5rem,86vw)] flex-col transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!open}
      >
        <SidebarBrand onClose={() => setOpen(false)} />
        <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
        <SidebarLogout logoutAction={logoutAction} />
      </aside>
    </>
  );
}
