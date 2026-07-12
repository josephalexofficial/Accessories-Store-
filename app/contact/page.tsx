import { Clock3, MapPin } from "lucide-react";
import { StoreLayout } from "@/components/layout/store-layout";
import { GmailIcon, WhatsAppBrandIcon } from "@/components/shared/brand-icons";
import { SocialLinks } from "@/components/shared/social-links";
import { BRAND, PICKUP_ADDRESS, PICKUP_HOURS } from "@/lib/constants";
import { buildGeneralInquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function ContactTile({
  icon,
  iconClassName,
  label,
  title,
  description,
  href,
  children,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  label: string;
  title: string;
  description: string;
  href?: string;
  children: React.ReactNode;
}) {
  const content = (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-border-brand/70 bg-gradient-to-br from-white via-white to-brand-tint/30 p-5 shadow-[0_8px_30px_rgba(0,86,210,0.06)] transition-all duration-200 md:p-6">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm md:h-12 md:w-12",
            iconClassName
          )}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            {label}
          </p>
          <h2 className="mt-1 text-lg font-black text-foreground md:text-xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-auto rounded-xl border border-border-brand/50 bg-white/80 p-4">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {content}
      </a>
    );
  }

  return content;
}

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppUrl(buildGeneralInquiryMessage());

  return (
    <StoreLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand">
            Reach Whimsey
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-3 text-sm leading-relaxed text-muted md:text-base">
            Get product guidance, order support, and quick answers from our
            team.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 md:gap-5">
          <ContactTile
            icon={<WhatsAppBrandIcon className="h-7 w-7 md:h-8 md:w-8" />}
            iconClassName="bg-transparent p-0 shadow-none"
            label="WhatsApp"
            title="Chat With Us"
            description="Fastest way to ask about products, stock, and orders."
            href={whatsappUrl}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1ea952]">
              Tap to message
            </p>
            <p className="mt-1.5 text-lg font-black text-foreground md:text-xl">
              {BRAND.whatsapp}
            </p>
          </ContactTile>

          <ContactTile
            icon={<GmailIcon className="h-6 w-6 md:h-7 md:w-7" />}
            iconClassName="bg-white ring-1 ring-border shadow-sm"
            label="Email"
            title="Write to Us"
            description="Best for detailed questions and follow-up support."
            href={`mailto:${BRAND.email}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Tap to email
            </p>
            <p className="mt-1.5 break-all text-base font-black text-foreground sm:break-normal md:text-lg">
              {BRAND.email}
            </p>
          </ContactTile>

          <ContactTile
            icon={<MapPin className="h-5 w-5 text-white md:h-6 md:w-6" />}
            iconClassName="bg-brand text-white shadow-[0_4px_14px_rgba(0,86,210,0.28)]"
            label="Visit Us"
            title="Our Store"
            description="Walk in and explore premium tech at our Nairobi location."
          >
            <p className="text-sm font-semibold leading-relaxed text-foreground">
              {PICKUP_ADDRESS}
            </p>
          </ContactTile>

          <ContactTile
            icon={<Clock3 className="h-5 w-5 text-white md:h-6 md:w-6" />}
            iconClassName="bg-brand text-white shadow-[0_4px_14px_rgba(0,86,210,0.28)]"
            label="Hours"
            title="Opening Times"
            description="Plan your visit or pickup around our business hours."
          >
            <p className="text-sm font-semibold leading-relaxed text-foreground">
              {PICKUP_HOURS}
            </p>
          </ContactTile>
        </section>

        <section className="mt-8 rounded-2xl border border-border-brand/70 bg-gradient-to-b from-white to-brand-tint/40 px-5 py-7 text-center shadow-[0_12px_40px_rgba(0,86,210,0.07)] md:mt-10 md:rounded-[1.75rem] md:px-8 md:py-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand">
            Follow Us
          </p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-foreground md:text-2xl">
            Stay Connected
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            Follow for deals, new arrivals, and updates from Whimsey.
          </p>
          <SocialLinks
            className="mt-5 justify-center gap-2.5 sm:gap-3"
            itemClassName="h-11 w-11 sm:h-12 sm:w-12"
            iconClassName="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]"
          />
        </section>
      </div>
    </StoreLayout>
  );
}
