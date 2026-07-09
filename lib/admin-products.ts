import { SHOP_CATEGORIES } from "./constants";

type ProductLike = { category: string; title: string };

export function groupByCategory<T extends ProductLike>(items: T[]) {
  const map = new Map<string, T[]>();

  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }

  const sortItems = (categoryItems: T[]) =>
    [...categoryItems].sort((a, b) => a.title.localeCompare(b.title));

  const grouped = SHOP_CATEGORIES.map((category) => ({
    category,
    items: sortItems(map.get(category) ?? []),
  })).filter((group) => group.items.length > 0);

  for (const [category, categoryItems] of map) {
    if (!SHOP_CATEGORIES.includes(category as (typeof SHOP_CATEGORIES)[number])) {
      grouped.push({
        category,
        items: sortItems(categoryItems),
      });
    }
  }

  return grouped;
}
