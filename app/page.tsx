import Link from "next/link";
import { Suspense } from "react";
import { StoreLayout } from "@/components/layout/store-layout";
import { CategoryPills } from "@/components/product/category-pills";
import { CategoryShowcase } from "@/components/product/category-showcase";
import { getProductsByCategory } from "@/lib/products";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURED_CATEGORIES = [
  "Laptops",
  "Smartphones",
  "Audio & Speakers",
  "Apple",
] as const;

export default async function HomePage() {
  const showcases = await Promise.all(
    FEATURED_CATEGORIES.map(async (category) => ({
      category,
      products: await getProductsByCategory(category, { limit: 5 }),
    }))
  );

  return (
    <StoreLayout>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand/10 to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <p className="text-xs font-bold tracking-[0.3em] text-brand md:text-sm">
            WHIMSEY TECHNOLOGIES
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Elevate Your Digital Workspace
          </h1>
          <p className="mt-4 max-w-lg text-sm text-muted md:text-base">
            Premium hardware ecosystems engineered for elite digital setups.
            Laptops, smartphones, audio gear, and accessories — curated for
            performance.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className={cn(buttonVariants({ size: "lg" }))}>
              Shop Now
            </Link>
            <Link
              href="/deals"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              View Deals
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Suspense fallback={null}>
          <CategoryPills />
        </Suspense>
      </section>

      <section className="mx-auto max-w-7xl space-y-12 px-4 pb-16 md:px-6 md:pb-24">
        {showcases.map(({ category, products }) => (
          <CategoryShowcase
            key={category}
            category={category}
            products={products}
          />
        ))}
      </section>
    </StoreLayout>
  );
}
