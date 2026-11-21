import { fallbackCategories, fallbackProducts, fallbackSiteSettings } from "@/data/products";
import type { Category, Product, SiteSettings } from "../types";
import { sanityClient } from "./client";

const categoryProjection = `{
  _id,
  title,
  "slug": slug.current,
  description,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt
}`;

const productProjection = `{
  _id,
  name,
  "slug": slug.current,
  description,
  priceDisplay,
  "category": category->${categoryProjection},
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  "additionalImages": additionalImages[]{"url": asset->url, alt},
  availability,
  dimensions,
  materials,
  colors,
  order
}`;

async function fetchSanity<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (!sanityClient) return fallback;

  try {
    const result = await sanityClient.fetch<T>(query, params, { next: { revalidate: 60 } });
    return result ?? fallback;
  } catch (error) {
    console.error("Sanity fetch failed; using fallback content.", error);
    return fallback;
  }
}

export function getCategories() {
  return fetchSanity<Category[]>(
    `*[_type == "category"] | order(order asc, title asc) ${categoryProjection}`,
    fallbackCategories,
  );
}

export function getProducts() {
  return fetchSanity<Product[]>(
    `*[_type == "product" && availability != "unavailable"] | order(_createdAt desc) ${productProjection}`,
    fallbackProducts,
  );
}

export async function getRecentProducts() {
  const recentProducts = await fetchSanity<Product[]>(
    `*[_type == "product" && availability != "unavailable"] | order(_createdAt desc) [0...6] ${productProjection}`,
    fallbackProducts.slice(0, 6),
  );

  return [...recentProducts].sort(() => Math.random() - 0.5).slice(0, 3);
}

export function getProductBySlug(slug: string) {
  return fetchSanity<Product | null>(
    `*[_type == "product" && slug.current == $slug][0] ${productProjection}`,
    fallbackProducts.find((product) => product.slug === slug) ?? null,
    { slug },
  );
}

export function getSiteSettings() {
  return fetchSanity<SiteSettings>(
    `*[_type == "siteSettings"][0]{
      brandName,
      tagline,
      announcement,
      "hero": hero{eyebrow, title, description, "imageUrl": image.asset->url, "imageAlt": image.alt, ctaLabel},
      "about": about{heading, description, "imageUrl": image.asset->url, "imageAlt": image.alt},
      services[]{_key, title, description},
      contact,
      socialLinks[]{_key, label, url}
    }`,
    fallbackSiteSettings,
  );
}
