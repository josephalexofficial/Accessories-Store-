import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { BRAND, NAV_LINKS, SOCIAL_LINKS, PICKUP_ADDRESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function SocialIcon({ name }: { name: string }) {
  const iconClass = "h-4 w-4";

  switch (name) {
    case "YouTube":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      );
    case "Facebook":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.27h3.32l-.53 3.49h-2.79v8.44C19.61 23.09 24 18.09 24 12.07z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.15.63c-.77.3-1.42.71-2.07 1.36C1.43 2.64 1.02 3.29.72 4.06.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.65 2.99.3.77.71 1.42 1.36 2.07.65.65 1.3 1.06 2.07 1.36.84.39 1.72.59 2.99.65C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.99-.65.77-.3 1.42-.71 2.07-1.36.65-.65 1.06-1.3 1.36-2.07.39-.84.59-1.72.65-2.99.06-1.28.07-1.67.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.65-2.99-.3-.77-.71-1.42-1.36-2.07-.65-.65-1.3-1.06-2.07-1.36-.84-.39-1.72-.59-2.99-.65C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
        </svg>
      );
    default:
      return (
        <span className="text-xs font-bold">{name.charAt(0)}</span>
      );
  }
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: BRAND.blue }}
              >
                W
              </span>
              <span className="text-lg font-semibold">{BRAND.name}</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {BRAND.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/track-order"
                  className="text-sm text-muted transition-colors hover:text-brand"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in touch */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-brand"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {BRAND.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{PICKUP_ADDRESS}</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-2 pt-1">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-all duration-200 hover:scale-105"
                  )}
                  style={{ color: social.color }}
                >
                  <SocialIcon name={social.name} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted">
          Copyright &copy; 2026 {BRAND.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
