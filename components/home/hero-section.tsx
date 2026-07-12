import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/** Premium workspace lifestyle — Unsplash */
export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1400&q=85";

export function HeroSection() {
  return (
    <section className="w-full bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6 lg:py-8">
        <div className="grid items-center gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-1 flex flex-col justify-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand md:text-sm">
              Whimsey Premium Tech Store
            </p>
            <h1 className="mt-2 text-[1.75rem] font-black leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-[2.75rem] lg:text-5xl">
              Tech That Elevates
              <span className="block text-brand">Your Workspace</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm font-semibold leading-relaxed text-ink-muted md:mt-4 md:text-base lg:text-lg">
              Genuine laptops, smartphones &amp; accessories. Visit us at Whimsey
              Business Plaza or order online — we deliver across Kenya.
            </p>
            <div className="mt-5 flex flex-row gap-2.5 md:mt-6">
              <Link
                href="/shop"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 flex-1 rounded-full px-4 text-center text-sm font-bold shadow-md sm:flex-none sm:px-7 md:h-12 md:px-8 md:text-base"
                )}
              >
                Shop Now
              </Link>
              <Link
                href="/deals"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 flex-1 rounded-full border-2 px-4 text-center text-sm font-bold sm:flex-none sm:px-7 md:h-12 md:px-8 md:text-base"
                )}
              >
                View Deals
              </Link>
            </div>
          </div>

          <div className="order-2 w-full min-w-0">
            <div className="relative aspect-[5/3] w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.07)] sm:aspect-[16/10] md:aspect-[5/4] lg:aspect-[4/3]">
              <Image
                src={HERO_IMAGE}
                alt="Premium laptop, headphones and ergonomic workspace setup"
                fill
                priority
                quality={75}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
