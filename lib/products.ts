import type { Prisma, Product as PrismaProduct, StockStatus, SpecType } from "@prisma/client";
import { prisma } from "./prisma";
import type { SortValue } from "./constants";

export type KeyValueSpec = { key: string; value: string };
export type Specifications = KeyValueSpec[] | string[];

export type Product = {
  id: string;
  title: string;
  brand: string;
  slug: string;
  category: string;
  price: number;
  salePrice: number | null;
  isSale: boolean;
  stockStatus: StockStatus;
  imageUrl: string | null;
  specType: SpecType;
  specifications: Specifications;
  viewCount: number;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductFilters = {
  category?: string;
  sort?: SortValue;
  isSale?: boolean;
  limit?: number;
};

function decimalToNumber(value: Prisma.Decimal | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

function serializeProduct(product: PrismaProduct): Product {
  return {
    ...product,
    price: Number(product.price),
    salePrice: decimalToNumber(product.salePrice),
    specifications: product.specifications as Specifications,
  };
}

export function getEffectivePrice(product: Pick<Product, "price" | "salePrice" | "isSale">): number {
  return product.isSale && product.salePrice != null ? product.salePrice : product.price;
}

function sortProducts(products: Product[], sort: SortValue): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    case "price-desc":
      return sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    case "popularity":
      return sorted.sort((a, b) => b.popularity - a.popularity);
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
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
      : sort === "newest"
        ? { createdAt: "desc" }
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

export async function findProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return null;
  return serializeProduct(product);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) return null;

  await prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  });

  return serializeProduct(product);
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
  const products = await prisma.product.findMany({
    select: { slug: true },
  });
  return products.map((p) => p.slug);
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
