import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { CartLink } from "./cart-link";
import { MobileNav } from "./mobile-nav";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16 md:px-6">
          <Link
            href="/"
            className="text-sm font-bold tracking-widest text-foreground md:text-base"
          >
            {BRAND.name.toUpperCase()}
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <CartLink />
          </nav>

          <MobileNav />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-auto border-t border-border bg-footer">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold tracking-widest">{BRAND.name.toUpperCase()}</p>
              <p className="mt-2 max-w-xs text-sm text-muted">{BRAND.tagline}</p>
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/track-order"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                Track Order
              </Link>
            </nav>
          </div>

          <p className="mt-8 border-t border-border pt-6 text-center text-xs text-muted md:text-left">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
