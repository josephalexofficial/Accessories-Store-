import type { StockStatus, SpecType } from "@prisma/client";

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

export function getEffectivePrice(
  product: Pick<Product, "price" | "salePrice" | "isSale">
): number {
  return product.isSale && product.salePrice != null ? product.salePrice : product.price;
}
