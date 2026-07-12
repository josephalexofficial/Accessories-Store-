import { Suspense } from "react";
import { StoreLayout } from "@/components/layout/store-layout";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryPills } from "@/components/product/category-pills";
import { CategoryShowcase } from "@/components/product/category-showcase";
import { SHOP_CATEGORIES } from "@/lib/constants";
import { getProductsByCategory } from "@/lib/products";

export const revalidate = 120;

export default async function HomePage() {
  const showcases = await Promise.all(
    SHOP_CATEGORIES.map(async (category) => ({
      category,
      products: await getProductsByCategory(category, { limit: 5 }),
    }))
  );

  return (
    <StoreLayout>
      {/*
        Hero min-height leaves room below the navbar so the products
        section peeks at the bottom of the first screen (mobile & desktop).
      */}
      <div className="flex min-h-[calc(100dvh-4rem-12.5rem)] items-center bg-canvas md:min-h-[calc(100dvh-4rem-8.5rem)]">
        <HeroSection />
      </div>

      <section className="bg-canvas pb-14 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-xl font-black tracking-tight text-brand md:text-2xl">
            Our Products
          </h2>
        </div>

        {/* Sticky under main navbar on mobile and desktop */}
        <div className="sticky top-16 z-40 mt-2.5 border-y border-border-brand/40 bg-canvas/95 backdrop-blur-md md:mt-3">
          <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 md:py-3.5">
            <Suspense fallback={null}>
              <CategoryPills
                activeCategory="All Products"
                basePath="/shop"
                showScrollHint
              />
            </Suspense>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl space-y-12 px-4 md:mt-10 md:px-6">
          {showcases.map(({ category, products }) => (
            <CategoryShowcase
              key={category}
              category={category}
              products={products}
              seeMoreLabel="See more →"
            />
          ))}
        </div>
      </section>
    </StoreLayout>
  );
}
