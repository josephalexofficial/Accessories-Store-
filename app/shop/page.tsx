import { Suspense } from "react";
import { StoreLayout } from "@/components/layout/store-layout";
import { CategoryPills } from "@/components/product/category-pills";
import { ShopSidebar } from "@/components/product/shop-sidebar";
import { SortBar } from "@/components/product/sort-bar";
import { ProductGrid } from "@/components/product/product-grid";
import { getProducts } from "@/lib/products";
import type { SortValue } from "@/lib/constants";

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

function parseSort(value?: string): SortValue {
  const valid: SortValue[] = ["newest", "price-asc", "price-desc", "popularity"];
  return valid.includes(value as SortValue) ? (value as SortValue) : "newest";
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category ?? "All Products";
  const sort = parseSort(params.sort);

  const products = await getProducts({ category, sort });

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Shop</h1>
          <p className="mt-1 text-sm text-muted">
            Browse our full collection of premium tech accessories.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="hidden w-56 shrink-0 md:block">
            <ShopSidebar activeCategory={category} />
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                {products.length} product{products.length !== 1 ? "s" : ""}
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

            <div className="md:hidden">
              <CategoryPills
                activeCategory={category}
                basePath="/shop"
                className="mb-4"
              />
            </div>

            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
