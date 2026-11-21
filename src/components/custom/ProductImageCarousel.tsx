"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { optimizedImageUrl } from "@/lib/image";

type CarouselImage = {
  url?: string;
  alt?: string;
};

type ProductImageCarouselProps = {
  images: CarouselImage[];
  productName: string;
  priority?: boolean;
};

export function ProductImageCarousel({ images, productName, priority = false }: ProductImageCarouselProps) {
  const validImages = images.filter((image): image is CarouselImage & { url: string } => Boolean(image.url));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (validImages.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % validImages.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [validImages.length]);

  if (!validImages.length) {
    return <div className="grid h-full place-items-center px-6 text-center text-sm text-muted-foreground">Image coming soon</div>;
  }

  return (
    <div className="absolute inset-0" aria-label={`${productName} images`}>
      {validImages.map((image, index) => (
        <Image
          key={`${image.url}-${index}`}
          src={optimizedImageUrl(image.url, 900)!}
          alt={image.alt || productName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${activeIndex === index ? "opacity-100" : "opacity-0"}`}
          priority={priority && index === 0}
        />
      ))}
      {validImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
          {validImages.map((image, index) => (
            <span key={`${image.url}-indicator-${index}`} className={`h-1 w-5 transition-colors duration-500 ${activeIndex === index ? "bg-white" : "bg-white/45"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
