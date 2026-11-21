"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { optimizedImageUrl } from "@/lib/image";
import type { Product } from "@/sanity/types";

export function ProductGallery({ product }: { product: Product }) {
  const images = [{ url: product.imageUrl, alt: product.imageAlt || product.name }, ...(product.additionalImages || [])].filter((image) => image.url);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  useEffect(() => {
    if (images.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [images.length]);

  return <div>
    <div className="relative aspect-[4/3] overflow-hidden bg-muted">{activeImage?.url ? <Image src={optimizedImageUrl(activeImage.url, 1400)!} alt={activeImage.alt || product.name} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /> : <div className="grid h-full place-items-center text-sm text-muted-foreground">Image coming soon</div>}</div>
    {images.length > 1 && <div className="mt-3 grid grid-cols-5 gap-3">{images.map((image, index) => <button type="button" key={`${image.url}-${index}`} onClick={() => setActiveIndex(index)} className={`relative aspect-square overflow-hidden border ${activeIndex === index ? "border-foreground" : "border-border"}`} aria-label={`View image ${index + 1}`}><Image src={optimizedImageUrl(image.url, 240)!} alt="" fill sizes="20vw" className="object-cover" /></button>)}</div>}
  </div>;
}
