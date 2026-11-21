"use client";

import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getWhatsAppHref } from "@/lib/whatsapp";
import type { Category, ContactDetails } from "@/sanity/types";

type NavBarProps = {
  brandName: string;
  announcement?: string;
  categories: Category[];
  contact?: ContactDetails;
};

const navItems = [
  ["Home", "/"],
  ["Furniture", "/products"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Contact", "/contacts"],
] as const;

function isCurrentPath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(isActive: boolean, mobile = false) {
  return [
    "relative after:absolute after:left-0 after:h-px after:w-full after:origin-left after:bg-foreground after:transition-transform after:duration-300 after:ease-out",
    mobile ? "border-b border-border py-4 text-lg after:bottom-2" : "text-muted-foreground transition-colors hover:text-foreground after:-bottom-2",
    isActive ? "text-foreground after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
  ].join(" ");
}

export function NavBar({ brandName, announcement, categories, contact }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() || "/";
  const whatsappHref = getWhatsAppHref(`Hello ${brandName}, I would like to make an order.`, contact);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {announcement && (
        <div className="bg-primary px-4 py-2 text-center text-[11px] font-medium tracking-wide text-primary-foreground">
          {announcement}
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <button type="button" className="inline-flex size-10 items-center justify-center lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu">
            <Menu className="size-5" />
          </button>

          <Link href="/" className="font-display text-xl tracking-[-0.04em] sm:text-2xl" aria-label={`${brandName} home`}>
            {brandName}
          </Link>

          <nav className="hidden items-center gap-8 text-sm lg:flex" aria-label="Main navigation">
            {navItems.map(([label, href]) => {
              const active = isCurrentPath(pathname, href);
              return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={navLinkClass(active)}>{label}</Link>;
            })}
          </nav>

          {whatsappHref && <a href={whatsappHref} target="_blank" rel="noreferrer" className="text-[#25D366] inline-flex items-center gap-2 border border-[#25D366] px-3 py-2 text-md font-semibold transition-colors hover:bg-[#25D366] hover:text-background sm:px-4">
            <MessageCircle className="size-4" />
            <span className="hidden sm:inline">WhatsApp us</span>
            <span className="sm:hidden">Chat</span>
          </a>}
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/30 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="min-h-full w-[88%] max-w-sm bg-background px-6 py-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-5">
              <span className="font-display text-xl">{brandName}</span>
              <button type="button" className="inline-flex size-10 items-center justify-center" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu">
                <X className="size-5" />
              </button>
            </div>
            <nav className="mt-6 grid gap-1" aria-label="Mobile navigation">
              {navItems.map(([label, href]) => {
                const active = isCurrentPath(pathname, href);
                return <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={() => setMenuOpen(false)} className={navLinkClass(active, true)}>{label}</Link>;
              })}
            </nav>
            {categories.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Browse by category</p>
                <div className="mt-3 grid gap-2 text-sm">
                  {categories.map((category) => (
                    <Link key={category._id} href={`/products?category=${category.slug}`} onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">{category.title}</Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
