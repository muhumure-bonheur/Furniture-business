import type { MetadataRoute } from "next";
import { getProducts } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await getProducts();
  const staticRoutes = ["", "/products", "/about", "/services", "/contacts"].map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date() }));
  return [...staticRoutes, ...products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, lastModified: new Date() }))];
}
