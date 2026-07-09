import type { Prisma, Product as PrismaProduct } from "@prisma/client";
import type { SortValue } from "./constants";
import type { Product } from "./product-types";

export type { Product } from "./product-types";

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

export function serializeProduct(product: PrismaProduct): Product {
  return {
    ...product,
    price: Number(product.price),
    salePrice: decimalToNumber(product.salePrice),
    specifications: product.specifications as Product["specifications"],
  };
}

export function sortProducts(products: Product[], sort: SortValue): Product[] {
  const sorted = [...products];

  const getPrice = (p: Product) =>
    p.isSale && p.salePrice != null ? p.salePrice : p.price;

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => getPrice(a) - getPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => getPrice(b) - getPrice(a));
    case "popularity":
      return sorted.sort((a, b) => b.popularity - a.popularity);
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}
