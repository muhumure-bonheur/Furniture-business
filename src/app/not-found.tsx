import Link from "next/link";

export default function NotFound() {
  return <div className="grid min-h-[60vh] place-items-center px-4 py-20 text-center"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">404</p><h1 className="mt-4 font-display text-5xl tracking-[-0.05em]">That piece isn&apos;t here.</h1><p className="mt-4 text-sm text-muted-foreground">The page may have moved, or the product is no longer available.</p><Link href="/products" className="mt-8 inline-flex bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Browse furniture</Link></div></div>;
}
