import "server-only";
import { unstable_cache } from "next/cache";
import type { Prisma, Product as PrismaProduct } from "@prisma/client";
import { prisma } from "./prisma";
import type { SortValue } from "./constants";
import {
  type Product,
  type ProductFilters,
  serializeProduct,
  sortProducts,
} from "./product-data";

export type { Product, ProductFilters } from "./product-data";
export { getEffectivePrice } from "./product-types";

const CACHE_SECONDS = 120;

async function fetchProductsFromDb(filters: ProductFilters): Promise<Product[]> {
  const { category, sort = "newest", isSale, limit } = filters;

  const where: Prisma.ProductWhereInput = {};

  if (category && category !== "All Products") {
    where.category = category;
  }

  if (isSale !== undefined) {
    where.isSale = isSale;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "popularity"
      ? { popularity: "desc" }
      : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    ...(limit ? { take: limit } : {}),
  });

  const serialized = products.map(serializeProduct);

  if (sort === "price-asc" || sort === "price-desc") {
    return sortProducts(serialized, sort);
  }

  return serialized;
}

const getCachedProducts = unstable_cache(
  async (cacheKey: string) => fetchProductsFromDb(JSON.parse(cacheKey) as ProductFilters),
  ["products-list"],
  { revalidate: CACHE_SECONDS, tags: ["products"] }
);

const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    const product = await prisma.product.findUnique({ where: { slug } });
    return product ? serializeProduct(product) : null;
  },
  ["product-by-slug"],
  { revalidate: CACHE_SECONDS, tags: ["products"] }
);

const getCachedProductSlugs = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({ select: { slug: true } });
    return products.map((p) => p.slug);
  },
  ["product-slugs"],
  { revalidate: CACHE_SECONDS, tags: ["products"] }
);

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  return getCachedProducts(JSON.stringify(filters));
}

export async function findProductBySlug(slug: string): Promise<Product | null> {
  return getCachedProductBySlug(slug);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return getCachedProductBySlug(slug);
}

export async function incrementProductViewCount(productId: string): Promise<void> {
  await prisma.product.update({
    where: { id: productId },
    data: { viewCount: { increment: 1 } },
  });
}

export async function getProductsByCategory(
  category: string,
  options?: { sort?: SortValue; limit?: number }
): Promise<Product[]> {
  return getProducts({
    category,
    sort: options?.sort ?? "newest",
    limit: options?.limit,
  });
}

export async function getAllProductSlugs(): Promise<string[]> {
  return getCachedProductSlugs();
}

export async function trackWhatsAppClick(
  productId: string,
  page?: string
): Promise<void> {
  await prisma.$transaction([
    prisma.whatsAppClick.create({
      data: { productId, page },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { popularity: { increment: 1 } },
    }),
  ]);
}
