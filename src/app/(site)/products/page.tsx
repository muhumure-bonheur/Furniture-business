import { ProductsClient } from "./ProductsClient";
import { getCategories, getProducts } from "@/sanity/lib/queries";

export const metadata = {
  title: "Furniture collection",
  description: "Explore Hassan Furnitures furniture collection for homes, offices, and considered spaces.",
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [{ category }, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()]);
  return <ProductsClient products={products} categories={categories} initialCategory={category || "all"} />;
}
