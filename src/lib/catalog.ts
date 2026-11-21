import type { Product } from "../sanity/types";

export type SortOption = "recent" | "name";

export function filterProducts(
  products: Product[],
  category: string,
  search: string,
  sort: SortOption,
): Product[] {
  const activeCategory = category.toLowerCase();
  const query = search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    if (activeCategory !== "all" && product.category?.slug !== activeCategory) return false;
    const haystack = [
      product.name,
      product.description,
      product.category?.title,
      ...(product.materials || []),
      ...(product.colors || []),
    ].filter(Boolean).join(" ").toLowerCase();
    return !query || haystack.includes(query);
  });

  return sort === "name"
    ? filtered.sort((first, second) => first.name.localeCompare(second.name))
    : filtered;
}
