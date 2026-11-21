import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { ProductImageCarousel } from "@/components/custom/ProductImageCarousel";
import { Reveal } from "@/components/custom/Reveal";
import { getProductInquiry, getWhatsAppHref } from "@/lib/whatsapp";
import type { Product } from "@/sanity/types";

export function ProductCard({ product }: { product: Product }) {
  const inquiryHref = getWhatsAppHref(getProductInquiry(product.name, product.priceDisplay));

  return (
    <Reveal className="h-full">
      <article className="group flex h-full flex-col border-b border-border pb-5">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <ProductImageCarousel
            productName={product.name}
            images={[{ url: product.imageUrl, alt: product.imageAlt || product.name }, ...(product.additionalImages || [])]}
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4 px-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {product.category?.title || "Furniture"}
            </p>
            <h2 className="mt-1 font-display text-xl leading-tight text-foreground">
              <Link href={`/products/${product.slug}`} className="hover:underline">
                {product.name}
              </Link>
            </h2>
          </div>
          <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="mt-1 text-muted-foreground transition-colors hover:text-foreground">
            <ArrowUpRight className="size-5" />
          </Link>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">{product.priceDisplay || "Price on request"}</span>
          <a
            href={inquiryHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground underline-offset-4 hover:underline"
          >
            <MessageCircle className="size-3.5" />
            Chat
          </a>
        </div>
      </div>
      </article>
    </Reveal>
  );
}
