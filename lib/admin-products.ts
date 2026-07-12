import { SHOP_CATEGORIES } from "./constants";

type ProductLike = { category: string; title: string };

type CategoryGroup<T> = {
  category: string;
  items: T[];
};

export function groupByCategory<T extends ProductLike>(items: T[]): CategoryGroup<T>[] {
  const map = new Map<string, T[]>();

  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }

  const sortItems = (categoryItems: T[]) =>
    [...categoryItems].sort((a, b) => a.title.localeCompare(b.title));

  const knownCategories = new Set<string>(SHOP_CATEGORIES);

  const grouped: CategoryGroup<T>[] = SHOP_CATEGORIES.map((category) => ({
    category,
    items: sortItems(map.get(category) ?? []),
  })).filter((group) => group.items.length > 0);

  for (const [category, categoryItems] of map) {
    if (!knownCategories.has(category)) {
      grouped.push({
        category,
        items: sortItems(categoryItems),
      });
    }
  }

  return grouped;
}
