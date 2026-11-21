import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category, SiteSettings } from "@/sanity/types";

export function Footer({ siteSettings, categories }: { siteSettings: SiteSettings; categories?: Category[] }) {
  const brandName = siteSettings.brandName;
  const contact = siteSettings.contact;

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="font-display text-3xl tracking-[-0.04em]">{brandName}</p>
          {siteSettings.tagline && <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/65">
            {siteSettings.tagline}
          </p>}
          {contact?.email && <a href={`mailto:${contact.email}`} className="mt-6 inline-block text-sm underline-offset-4 hover:underline">{contact.email}</a>}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/55">Explore</p>
          <div className="mt-4 grid gap-3 text-sm text-primary-foreground/75">
            <Link href="/products" className="hover:text-primary-foreground">Furniture</Link>
            <Link href="/about" className="hover:text-primary-foreground">About</Link>
            <Link href="/services" className="hover:text-primary-foreground">Services</Link>
            <Link href="/contacts" className="hover:text-primary-foreground">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/55">Categories</p>
          <div className="mt-4 grid gap-3 text-sm text-primary-foreground/75">
            {(categories || []).slice(0, 5).map((category) => (
              <Link key={category._id} href={`/products?category=${category.slug}`} className="hover:text-primary-foreground">{category.title}</Link>
            ))}
            {!categories?.length && <Link href="/products" className="hover:text-primary-foreground">View furniture</Link>}
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 px-4 py-5 text-center text-xs text-primary-foreground/55">
        <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
        {siteSettings?.socialLinks?.map((social) => (
          <a key={social._key || social.label} href={social.url} target="_blank" rel="noreferrer" className="ml-4 inline-flex items-center gap-1 hover:text-primary-foreground">
            {social.label}<ArrowUpRight className="size-3" />
          </a>
        ))}
      </div>
    </footer>
  );
}
