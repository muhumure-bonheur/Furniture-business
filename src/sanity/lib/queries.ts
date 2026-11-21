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
  params: Record<string, unknown> = {},
): Promise<T> {
  if (!sanityClient) {
    throw new Error("Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID to load published content.");
  }

  return sanityClient.fetch<T>(query, params, { next: { revalidate: 60 } });
}

export async function getCategories() {
  return (await fetchSanity<Category[] | null>(
    `*[_type == "category"] | order(order asc, title asc) ${categoryProjection}`,
  )) ?? [];
}

export async function getProducts() {
  return (await fetchSanity<Product[] | null>(
    `*[_type == "product" && availability != "unavailable"] | order(_createdAt desc) ${productProjection}`,
  )) ?? [];
}

export async function getRecentProducts() {
  const recentProducts = await fetchSanity<Product[] | null>(
    `*[_type == "product" && availability != "unavailable"] | order(_createdAt desc) [0...6] ${productProjection}`,
  );

  return (recentProducts ?? []).slice(0, 3);
}

export function getProductBySlug(slug: string) {
  return fetchSanity<Product | null>(
    `*[_type == "product" && slug.current == $slug][0] ${productProjection}`,
    { slug },
  );
}

export async function getSiteSettings() {
  const settings = await fetchSanity<SiteSettings | null>(
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
  );

  if (!settings?.brandName?.trim()) {
    throw new Error("Publish a Site settings document with a brand name in Sanity Studio before serving the website.");
  }
  return settings;
}
