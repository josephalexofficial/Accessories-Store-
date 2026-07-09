import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { StoreLayout } from "@/components/layout/store-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND, SOCIAL_LINKS } from "@/lib/constants";
import { buildGeneralInquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppUrl(buildGeneralInquiryMessage());

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 text-center md:mb-12">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-muted md:text-base">
            We&apos;re here to help with orders, product questions, and support.
          </p>
        </div>

        <div className="mx-auto grid max-w-2xl gap-4 md:grid-cols-2 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted">
                Chat with us directly for the fastest response.
              </p>
              <p className="text-lg font-semibold">{BRAND.whatsapp}</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "whatsapp" }), "w-full")}
              >
                Open WhatsApp
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-5 w-5 text-brand" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted">
                Send us an email and we&apos;ll get back to you within 24 hours.
              </p>
              <p className="text-lg font-semibold">{BRAND.email}</p>
              <a
                href={`mailto:${BRAND.email}`}
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              >
                Send Email
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-12 max-w-md text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Follow Us
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:scale-110"
                style={{ color: social.color }}
                aria-label={social.name}
              >
                <span className="text-xs font-bold">{social.name[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
