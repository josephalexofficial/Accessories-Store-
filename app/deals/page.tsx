import { Suspense } from "react";
import { StoreLayout } from "@/components/layout/store-layout";
import { CategoryPills } from "@/components/product/category-pills";
import { ShopSidebar } from "@/components/product/shop-sidebar";
import { SortBar } from "@/components/product/sort-bar";
import { MobileFiltersSort } from "@/components/product/mobile-filters-sort";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPagination } from "@/components/product/product-pagination";
import { getProductsPage } from "@/lib/products";
import { parseShopQuery } from "@/lib/shop-params";

interface DealsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    min?: string;
    max?: string;
    page?: string;
  }>;
}

export const revalidate = 120;

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams;
  const { category, sort, q, minPrice, maxPrice, page } = parseShopQuery(params);

  const {
    items: products,
    total,
    page: currentPage,
    pageSize,
    totalPages,
  } = await getProductsPage(
    {
      category,
      sort,
      isSale: true,
      q: q || undefined,
      minPrice,
      maxPrice,
    },
    page
  );

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, total);

  const countLabel =
    total === 0
      ? "0 deals"
      : totalPages > 1
        ? `Showing ${rangeStart}–${rangeEnd} of ${total} deals`
        : `${total} deal${total !== 1 ? "s" : ""}`;

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Deals</h1>
          <p className="mt-1 hidden text-sm text-muted md:block">
            {q
              ? `Deal results for “${q}”.`
              : "Limited-time offers on premium tech — grab them before they\u2019re gone."}
          </p>
        </div>

        <div className="sticky top-16 z-40 -mx-4 mb-4 border-b border-border bg-canvas/95 px-4 py-2.5 backdrop-blur-md md:hidden">
          <Suspense fallback={null}>
            <CategoryPills activeCategory={category} basePath="/deals" />
          </Suspense>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="hidden w-56 shrink-0 md:block">
            <Suspense fallback={null}>
              <ShopSidebar activeCategory={category} basePath="/deals" />
            </Suspense>
          </div>

          <div className="flex-1 space-y-5 md:space-y-6">
            <div className="hidden items-center justify-between gap-4 md:flex">
              <p className="text-sm text-muted">
                {countLabel}
                {category !== "All Products" && (
                  <span>
                    {" "}
                    in <span className="text-foreground">{category}</span>
                  </span>
                )}
              </p>
              <Suspense fallback={null}>
                <SortBar />
              </Suspense>
            </div>

            <div className="space-y-3 md:hidden">
              <Suspense fallback={null}>
                <MobileFiltersSort />
              </Suspense>
              <p className="text-sm text-muted">
                {countLabel}
                {category !== "All Products" && (
                  <span>
                    {" "}
                    in <span className="text-foreground">{category}</span>
                  </span>
                )}
              </p>
            </div>

            <ProductGrid
              products={products}
              emptyMessage="No deals available right now. Check back soon!"
              priorityCount={currentPage === 1 ? 8 : 0}
            />

            <Suspense fallback={null}>
              <ProductPagination page={currentPage} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
