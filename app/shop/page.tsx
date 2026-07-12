import { Suspense } from "react";
import { StoreLayout } from "@/components/layout/store-layout";
import { CategoryPills } from "@/components/product/category-pills";
import { ShopSidebar } from "@/components/product/shop-sidebar";
import { SortBar } from "@/components/product/sort-bar";
import { MobileFiltersSort } from "@/components/product/mobile-filters-sort";
import { ProductGrid } from "@/components/product/product-grid";
import { getProducts } from "@/lib/products";
import { parseShopQuery } from "@/lib/shop-params";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    min?: string;
    max?: string;
  }>;
}

export const revalidate = 120;

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { category, sort, q, minPrice, maxPrice } = parseShopQuery(params);

  const products = await getProducts({
    category,
    sort,
    q: q || undefined,
    minPrice,
    maxPrice,
  });

  const emptyMessage = q
    ? `No products found for “${q}”. Try a different search.`
    : "No products found.";

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl font-bold text-ink md:text-3xl">Shop</h1>
          <p className="mt-1 hidden text-sm text-ink-muted md:block">
            {q
              ? `Search results for “${q}”.`
              : "Browse our full collection of premium tech accessories."}
          </p>
          {q && (
            <p className="mt-1 text-sm text-ink-muted md:hidden">
              Results for “{q}”
            </p>
          )}
        </div>

        {/* Sticky category pills — mobile only */}
        <div className="sticky top-16 z-40 -mx-4 mb-4 border-b border-border bg-canvas/95 px-4 py-2.5 backdrop-blur-md md:hidden">
          <Suspense fallback={null}>
            <CategoryPills activeCategory={category} basePath="/shop" />
          </Suspense>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="hidden w-56 shrink-0 md:block">
            <Suspense fallback={null}>
              <ShopSidebar activeCategory={category} />
            </Suspense>
          </div>

          <div className="flex-1 space-y-5 md:space-y-6">
            {/* Desktop: count + sort */}
            <div className="hidden items-center justify-between gap-4 md:flex">
              <p className="text-sm text-muted">
                {products.length} product{products.length !== 1 ? "s" : ""}
                {category !== "All Products" && (
                  <span>
                    {" "}
                    in <span className="text-foreground">{category}</span>
                  </span>
                )}
                {(minPrice != null || maxPrice != null) && (
                  <span>
                    {" "}
                    · Price
                    {minPrice != null ? ` from ${minPrice.toLocaleString()}` : ""}
                    {maxPrice != null ? ` up to ${maxPrice.toLocaleString()}` : ""}
                  </span>
                )}
              </p>
              <Suspense fallback={null}>
                <SortBar />
              </Suspense>
            </div>

            {/* Mobile: compact filters dropdown + count */}
            <div className="space-y-3 md:hidden">
              <Suspense fallback={null}>
                <MobileFiltersSort />
              </Suspense>
              <p className="text-sm text-muted">
                {products.length} product{products.length !== 1 ? "s" : ""}
                {category !== "All Products" && (
                  <span>
                    {" "}
                    in <span className="text-foreground">{category}</span>
                  </span>
                )}
              </p>
            </div>

            <ProductGrid products={products} emptyMessage={emptyMessage} />
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
