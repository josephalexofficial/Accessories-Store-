import Link from "next/link";
import { Suspense } from "react";
import { StoreLayout } from "@/components/layout/store-layout";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryPills } from "@/components/product/category-pills";
import { CategoryShowcase } from "@/components/product/category-showcase";
import { ProductGrid } from "@/components/product/product-grid";
import { getProductsByCategory } from "@/lib/products";

const FEATURED_CATEGORIES = [
  "Laptops",
  "Smartphones",
  "Audio & Speakers",
  "Apple",
] as const;

export const revalidate = 120;

export default async function HomePage() {
  const showcases = await Promise.all(
    FEATURED_CATEGORIES.map(async (category) => ({
      category,
      products: await getProductsByCategory(category, { limit: 5 }),
    }))
  );

  const leadCategory = showcases[0];

  return (
    <StoreLayout>
      {/*
        Hero min-height leaves room below the navbar so the products
        section peeks at the bottom of the first screen (mobile & desktop).
      */}
      <div className="flex min-h-[calc(100dvh-4rem-12.5rem)] items-center bg-canvas md:min-h-[calc(100dvh-4rem-8.5rem)]">
        <HeroSection />
      </div>

      <section className="bg-canvas pb-6 md:pb-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-xl font-black tracking-tight text-brand md:text-2xl">
            Our Products
          </h2>
          <div className="mt-2.5 border-t border-border-brand/40 pt-3 md:mt-3 md:pt-4">
            <Suspense fallback={null}>
              <CategoryPills activeCategory="All Products" showScrollHint />
            </Suspense>
          </div>

          {leadCategory.products.length > 0 && (
            <div className="mt-4 md:mt-5">
              <div className="mb-3 flex items-center justify-between md:mb-4">
                <h3 className="text-base font-bold text-brand md:text-lg">
                  {leadCategory.category}
                </h3>
                <Link
                  href={`/shop?category=${encodeURIComponent(leadCategory.category)}`}
                  className="text-xs font-semibold text-brand hover:underline md:text-sm"
                >
                  See more →
                </Link>
              </div>
              <ProductGrid products={leadCategory.products.slice(0, 4)} />
            </div>
          )}
        </div>
      </section>

      <section className="bg-canvas pb-14 md:pb-20">
        <div className="mx-auto max-w-7xl space-y-12 px-4 md:px-6">
          {showcases.slice(1).map(({ category, products }) => (
            <CategoryShowcase
              key={category}
              category={category}
              products={products}
              seeMoreLabel="See more →"
            />
          ))}
          {leadCategory.products.length > 4 && (
            <CategoryShowcase
              category={leadCategory.category}
              products={leadCategory.products.slice(4)}
              seeMoreLabel="See more →"
            />
          )}
        </div>
      </section>
    </StoreLayout>
  );
}
