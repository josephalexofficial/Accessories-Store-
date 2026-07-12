"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  PackageSearch,
} from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const totalItems = useCart((s) => s.totalItems());
  const hasHydrated = useCart((s) => s.hasHydrated);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const cartCount = hasHydrated ? totalItems : 0;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/shop");
    }
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const navLinkClass = (href: string) =>
    cn(
      "text-sm font-medium transition-colors duration-200",
      isActive(href)
        ? "font-semibold text-brand"
        : "text-ink-muted hover:text-brand"
    );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-canvas/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white transition-transform group-hover:scale-105">
            W
          </span>
          <span className="hidden font-bold tracking-tight text-ink sm:inline md:text-base">
            {BRAND.name}
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <Input
              type="search"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-48 border-border-brand bg-brand-tint pl-9 lg:w-56"
            />
          </form>

          <Button
            variant="ghost"
            size="icon"
            className="text-ink md:hidden"
            onClick={() => {
              setSearchOpen((prev) => !prev);
              setMobileOpen(false);
            }}
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/track-order" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-1.5 text-ink-muted">
              <PackageSearch className="h-4 w-4" />
              <span className="hidden lg:inline">Track Order</span>
            </Button>
          </Link>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="text-ink" aria-label="Shopping cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-ink md:hidden"
            onClick={() => {
              setMobileOpen((prev) => !prev);
              setSearchOpen(false);
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-canvas px-4 py-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <Input
              type="search"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-border-brand bg-brand-tint pl-9"
              autoFocus
            />
          </form>
        </div>
      )}

      {mobileOpen && (
        <nav className="border-t border-border bg-canvas md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-brand-light font-semibold text-brand"
                    : "text-ink-muted hover:bg-brand-tint hover:text-brand"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/track-order"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-brand-tint hover:text-brand sm:hidden"
            >
              <PackageSearch className="h-4 w-4" />
              Track Order
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
