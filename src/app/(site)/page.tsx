import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/custom/ProductCard";
import { optimizedImageUrl } from "@/lib/image";
import { getCategories, getRecentProducts, getSiteSettings } from "@/sanity/lib/queries";

export default async function HomePage() {
  const [siteSettings, categories, recentProducts] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getRecentProducts(),
  ]);
  const hero = siteSettings.hero;
  const about = siteSettings.about;

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16 lg:px-8 lg:pb-28 lg:pt-14">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{hero?.eyebrow}</p>
          <h1 className="mt-5 max-w-lg font-display text-5xl leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">{hero?.title || siteSettings.brandName}</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">{hero?.description}</p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85">{hero?.ctaLabel || "Explore the collection"}<ArrowRight className="size-4" /></Link>
            <Link href="/about" className="text-sm font-semibold underline-offset-4 hover:underline">Our approach</Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] min-h-[360px] overflow-hidden bg-muted lg:min-h-[540px]">
          {optimizedImageUrl(hero?.imageUrl, 1600) ? (
            <Image src={optimizedImageUrl(hero?.imageUrl, 1600)!} alt={hero?.imageAlt || "Furniture from Hassan Furnitures"} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
          ) : <div className="grid h-full place-items-center text-sm text-muted-foreground">Image coming soon</div>}
        </div>
      </section>

      <section className="border-y border-border bg-muted/25 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">A closer look</p>
              <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] sm:text-4xl">New furniture</h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">View all furniture <ArrowRight className="size-4" /></Link>
          </div>
          {recentProducts.length ? (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {recentProducts.map((product) => <ProductCard key={product._id} product={product} contact={siteSettings.contact} />)}
            </div>
          ) : <p className="mt-10 border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">No furniture is available yet. Please check back soon.</p>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex items-end justify-between gap-6">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Find your fit</p><h2 className="mt-3 font-display text-3xl tracking-[-0.04em] sm:text-4xl">Browse by category</h2></div>
          <Link href="/products" className="hidden items-center gap-2 text-sm font-semibold sm:inline-flex">All furniture <ArrowUpRight className="size-4" /></Link>
        </div>
        <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const image = optimizedImageUrl(category.imageUrl, 900);
            return <Link key={category._id} href={`/products?category=${category.slug}`} className="group relative flex min-h-56 flex-col justify-end overflow-hidden bg-background p-6">
              {image && <Image src={image} alt={category.imageAlt || category.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-85" />}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/15 to-transparent" />
              <div className="relative z-10 text-white"><h3 className="font-display text-2xl">{category.title}</h3><p className="mt-1 max-w-xs text-sm text-white/75">{category.description}</p></div>
            </Link>;
          })}
        </div>
      </section>

      {about && <section className="border-t border-border bg-primary text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8 lg:py-28"><div className="relative aspect-[4/3] overflow-hidden bg-primary-foreground/10">{optimizedImageUrl(about.imageUrl, 1200) && <Image src={optimizedImageUrl(about.imageUrl, 1200)!} alt={about.imageAlt || "Hassan Furnitures interior"} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />}</div><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/55">The Hassan approach</p><h2 className="mt-4 max-w-lg font-display text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">{about.heading}</h2><p className="mt-6 max-w-lg text-base leading-7 text-primary-foreground/70">{about.description}</p><Link href="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">More about us <ArrowRight className="size-4" /></Link></div></div></section>}

      {!!siteSettings.services?.length && <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">What we do</p><div className="mt-8 grid gap-8 border-t border-border pt-8 md:grid-cols-3">{siteSettings.services.map((service) => <div key={service._key || service.title}><h2 className="font-display text-2xl">{service.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{service.description}</p></div>)}</div></section>}
    </div>
  );
}
