export const SHOP_PAGE_SIZE = 24;

export function parsePageParam(value?: string | null): number {
  if (value == null || value.trim() === "") return 1;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export type PaginationItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; id: string };

/** Compact page list: 1 2 3 … 40 (with current nearby) */
export function buildPaginationItems(
  current: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= 1) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: "page" as const,
      page: i + 1,
    }));
  }

  const pages = new Set<number>([1, totalPages]);

  for (let p = current - 1; p <= current + 1; p += 1) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }

  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (current >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  let previous = 0;

  for (const page of sorted) {
    if (previous > 0 && page - previous > 1) {
      items.push({ type: "ellipsis", id: `${previous}-${page}` });
    }
    items.push({ type: "page", page });
    previous = page;
  }

  return items;
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number = SHOP_PAGE_SIZE
): {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}
