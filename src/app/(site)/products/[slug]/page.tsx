import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/custom/ProductCard";
import { ProductGallery } from "./ProductGallery";
import { getProductBySlug, getProducts, getSiteSettings } from "@/sanity/lib/queries";
import { getProductInquiry, getWhatsAppHref } from "@/lib/whatsapp";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Furniture not found" };
  return { title: product.name, description: product.description, openGraph: { title: product.name, description: product.description, images: product.imageUrl ? [{ url: product.imageUrl, alt: product.imageAlt || product.name }] : undefined } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const [allProducts, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  const related = allProducts.filter((item) => item._id !== product._id && item.category?.slug === product.category?.slug).slice(0, 3);
  const inquiryHref = getWhatsAppHref(getProductInquiry(product.name, product.priceDisplay), settings.contact);

  return <div className="min-h-screen"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14"><Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to furniture</Link><div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"><ProductGallery product={product} /><div className="lg:pt-4"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{product.category?.title || "Furniture"}</p><h1 className="mt-4 font-display text-5xl leading-none tracking-[-0.055em] sm:text-6xl">{product.name}</h1><p className="mt-6 text-base leading-7 text-muted-foreground">{product.description}</p><div className="mt-8 border-y border-border py-5"><p className="text-lg font-medium">{product.priceDisplay || "Price on request"}</p>{product.availability === "made-to-order" && <p className="mt-1 text-sm text-muted-foreground">Made to order</p>}{product.availability === "unavailable" && <p className="mt-1 text-sm text-muted-foreground">Currently unavailable</p>}</div>{inquiryHref && <a href={inquiryHref} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 sm:w-auto"><MessageCircle className="size-4" /> Order / Chat on WhatsApp</a>}<div className="mt-10 grid gap-5 border-t border-border pt-6 text-sm">{product.dimensions && <div><p className="font-semibold">Dimensions</p><p className="mt-1 text-muted-foreground">{product.dimensions}</p></div>}{product.materials?.length ? <div><p className="font-semibold">Materials</p><p className="mt-1 text-muted-foreground">{product.materials.join(", ")}</p></div> : null}{product.colors?.length ? <div><p className="font-semibold">Colours / variants</p><p className="mt-1 text-muted-foreground">{product.colors.join(", ")}</p></div> : null}</div></div></div></div>{related.length > 0 && <section className="mx-auto max-w-7xl border-t border-border px-4 py-16 sm:px-6 lg:px-8"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">You may also like</p><div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item._id} product={item} contact={settings.contact} />)}</div></section>}</div>;
}
