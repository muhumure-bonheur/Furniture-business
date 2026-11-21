import type { Category, Product, SiteSettings } from "@/sanity/types";

// Import-only sample content. Never import this file into the website runtime.
const sampleImages = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg",
];

export const sampleCategories: Category[] = [
  { _id: "sample-sofas", title: "Sofas", slug: "sofas", description: "Comfort-led seating for everyday living." },
  { _id: "sample-beds", title: "Beds", slug: "beds", description: "Restful pieces made for quiet spaces." },
  { _id: "sample-tables", title: "Tables", slug: "tables", description: "Gathering places with considered proportions." },
  { _id: "sample-chairs", title: "Chairs", slug: "chairs", description: "Supportive seating with lasting character." },
  { _id: "sample-office", title: "Office Furniture", slug: "office-furniture", description: "Thoughtful pieces for focused work." },
  { _id: "sample-custom", title: "Custom Furniture", slug: "custom-furniture", description: "Furniture made around your space." },
];

const categoryByTitle = new Map(sampleCategories.map((category) => [category.title, category]));

const sampleProduct = (
  id: string,
  name: string,
  category: string,
  image: string,
  description: string,
  order: number,
): Product => ({
  _id: id,
  name,
  slug: id,
  description,
  priceDisplay: "Price on request",
  category: categoryByTitle.get(category),
  imageUrl: image,
  imageAlt: name,
  availability: "available",
  order,
});

export const sampleProducts: Product[] = [
  sampleProduct("cloud-modular-sofa", "Cloud Modular Sofa", "Sofas", sampleImages[0], "A generous modular sofa designed around relaxed living and easy conversation.", 1),
  sampleProduct("linen-lounge-chair", "Linen Lounge Chair", "Chairs", sampleImages[1], "A quiet reading chair with a generous seat and tactile natural upholstery.", 2),
  sampleProduct("oak-platform-bed", "Oak Platform Bed", "Beds", sampleImages[2], "A low, calm bed frame with clean lines and a warm timber presence.", 3),
  sampleProduct("family-dining-table", "Family Dining Table", "Tables", sampleImages[3], "A solid dining table made for long lunches, everyday meals, and gathering.", 4),
  sampleProduct("ribbed-sideboard", "Ribbed Sideboard", "Office Furniture", sampleImages[4], "Practical storage with a composed silhouette for dining rooms, studios, and offices.", 5),
  sampleProduct("custom-bedroom-suite", "Custom Bedroom Suite", "Custom Furniture", sampleImages[5], "A tailored bedroom collection developed to suit your room, routine, and material preferences.", 6),
];

export const sampleSiteSettings: SiteSettings = {
  brandName: "Hassan Furnitures",
  tagline: "Furniture for the way you live.",
  announcement: "Made-to-order furniture, considered for everyday life.",
  hero: {
    eyebrow: "Furniture for the way you live",
    title: "Pieces with presence, made to be lived with.",
    description: "Hassan Furnitures creates enduring pieces for homes, offices, and hospitality spaces. Browse the collection, then speak with our team on WhatsApp.",
    imageUrl: sampleImages[0],
    imageAlt: "A comfortable modular sofa in a bright living room",
    ctaLabel: "Explore the collection",
  },
  about: {
    heading: "A considered approach to furniture.",
    description: "We focus on useful proportions, honest materials, and craftsmanship that holds up to real life. Every piece begins with the space it needs to serve.",
    imageUrl: sampleImages[4],
    imageAlt: "Wooden furniture in a warm interior",
  },
  services: [
    { title: "Furniture supply", description: "A curated range of pieces for living, dining, sleeping, and working spaces." },
    { title: "Custom furniture", description: "Made-to-measure furniture developed around your room, finish, and needs." },
    { title: "Space guidance", description: "Practical advice on proportions, materials, and furniture choices for your space." },
  ],
};

export type { Category, Product, SiteSettings } from "@/sanity/types";
