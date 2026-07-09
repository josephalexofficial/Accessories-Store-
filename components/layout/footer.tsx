import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { BRAND, NAV_LINKS, PICKUP_ADDRESS } from "@/lib/constants";
import { SocialLinks } from "@/components/shared/social-links";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">
      {children}
    </h3>
  );
}

export function Footer() {
  const quickLinks = [
    ...NAV_LINKS,
    { href: "/track-order", label: "Track Order" },
  ];

  return (
    <footer className="footer-premium mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex w-fit items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-base font-black text-brand shadow-md">
                W
              </span>
              <span className="text-lg font-bold tracking-tight text-white md:text-xl">
                {BRAND.name}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              {BRAND.tagline}
            </p>
            <div className="mt-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
                Follow us
              </p>
              <SocialLinks />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4 lg:col-span-3 lg:pl-4">
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
            <FooterHeading>Get in Touch</FooterHeading>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="group inline-flex items-start gap-3 text-sm text-white/65 transition-colors hover:text-white"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-300">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="pt-1 leading-snug group-hover:underline">
                    {BRAND.email}
                  </span>
                </a>
              </li>
              <li>
                <div className="inline-flex items-start gap-3 text-sm text-white/65">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-300">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="pt-1 leading-relaxed">{PICKUP_ADDRESS}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-white/45">
            Copyright &copy; {new Date().getFullYear()} {BRAND.name}. All rights
            reserved.
          </p>
          <p className="text-xs text-white/35">
            Premium tech, delivered across Kenya.
          </p>
        </div>
      </div>
    </footer>
  );
}
