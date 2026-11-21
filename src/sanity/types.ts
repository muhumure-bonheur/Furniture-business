export type SanityImage = {
  _key?: string;
  alt?: string;
  asset?: {
    _ref?: string;
    url?: string;
  };
  url?: string;
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type ProductAvailability = "available" | "made-to-order" | "unavailable";

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  priceDisplay?: string;
  category?: Category;
  imageUrl?: string;
  imageAlt?: string;
  additionalImages?: Array<{ url?: string; alt?: string }>;
  availability?: ProductAvailability;
  dimensions?: string;
  materials?: string[];
  colors?: string[];
  order?: number;
};

export type Service = {
  _key?: string;
  title: string;
  description?: string;
};

export type ContactDetails = {
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  hours?: string;
};

export type SiteSettings = {
  brandName: string;
  tagline?: string;
  announcement?: string;
  hero?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    imageAlt?: string;
    ctaLabel?: string;
  };
  about?: {
    heading?: string;
    description?: string;
    imageUrl?: string;
    imageAlt?: string;
  };
  services?: Service[];
  contact?: ContactDetails;
  socialLinks?: Array<{ _key?: string; label: string; url: string }>;
};
