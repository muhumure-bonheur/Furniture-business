"use client";

import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/custom/ProductCard";
import { filterProducts, type SortOption } from "@/lib/catalog";
import type { Category, ContactDetails, Product } from "@/sanity/types";

export function ProductsClient({ products, categories, initialCategory, contact }: { products: Product[]; categories: Category[]; initialCategory: string; contact?: ContactDetails }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const activeCategory = initialCategory.toLowerCase();

  const filteredProducts = useMemo(() => {
    return filterProducts(products, activeCategory, searchQuery, sortBy);
  }, [activeCategory, products, searchQuery, sortBy]);

  const activeCategoryTitle = categories.find((category) => category.slug === activeCategory)?.title;

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/25 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">The collection</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="font-display text-4xl tracking-[-0.055em] sm:text-5xl">{activeCategoryTitle || "Furniture"}</h1><p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">Furniture made for homes, workspaces, and the in-between. Browse the collection, then contact us for current pricing and availability.</p></div><p className="text-sm text-muted-foreground">{products.length} {products.length === 1 ? "piece" : "pieces"}</p></div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1"><Link href="/products" className={`shrink-0 border px-4 py-2 text-sm ${activeCategory === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>All furniture</Link>{categories.map((category) => <Link key={category._id} href={`/products?category=${category.slug}`} className={`shrink-0 border px-4 py-2 text-sm ${activeCategory === category.slug ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>{category.title}</Link>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between"><label className="relative block max-w-md flex-1"><span className="sr-only">Search furniture</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search furniture, materials, colours..." className="w-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-foreground" /></label><div className="flex items-center gap-3 text-sm"><label htmlFor="sort" className="text-muted-foreground">Sort by</label><select id="sort" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className="border border-border bg-background px-3 py-3 text-sm outline-none"><option value="recent">Recent</option><option value="name">Name</option></select></div></div>
        {filteredProducts.length ? <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{filteredProducts.map((product) => <ProductCard key={product._id} product={product} contact={contact} />)}</div> : <div className="py-24 text-center"><SlidersHorizontal className="mx-auto size-8 text-muted-foreground" /><h2 className="mt-5 font-display text-2xl">No furniture found</h2><p className="mt-2 text-sm text-muted-foreground">Try another search or browse the full collection.</p><Link href="/products" onClick={() => { setSearchQuery(""); setSortBy("recent"); }} className="mt-6 inline-flex border border-foreground px-4 py-2 text-sm font-semibold">Reset filters</Link></div>}
      </section>
    </div>
  );
}
