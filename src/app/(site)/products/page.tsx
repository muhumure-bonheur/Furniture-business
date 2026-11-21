import { ProductsClient } from "./ProductsClient";
import { getCategories, getProducts, getSiteSettings } from "@/sanity/lib/queries";

export const metadata = {
  title: "Furniture collection",
  description: "Explore Hassan Furnitures furniture collection for homes, offices, and considered spaces.",
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const [{ category }, products, categories, settings] = await Promise.all([searchParams, getProducts(), getCategories(), getSiteSettings()]);
  const selectedCategory = Array.isArray(category) ? category[0] : category;
  return <ProductsClient products={products} categories={categories} initialCategory={selectedCategory || "all"} contact={settings.contact} />;
}
