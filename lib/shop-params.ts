import type { SortValue } from "./constants";

export type ShopQuery = {
  category: string;
  sort: SortValue;
  q: string;
  minPrice: number | null;
  maxPrice: number | null;
};

const SORT_VALUES: SortValue[] = [
  "newest",
  "price-asc",
  "price-desc",
  "popularity",
];

export function parseSort(value?: string | null): SortValue {
  return SORT_VALUES.includes(value as SortValue)
    ? (value as SortValue)
    : "popularity";
}

export function parsePriceParam(value?: string | null): number | null {
  if (value == null || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function parseShopQuery(params: {
  category?: string;
  sort?: string;
  q?: string;
  min?: string;
  max?: string;
}): ShopQuery {
  return {
    category: params.category?.trim() || "All Products",
    sort: parseSort(params.sort),
    q: params.q?.trim() || "",
    minPrice: parsePriceParam(params.min),
    maxPrice: parsePriceParam(params.max),
  };
}
