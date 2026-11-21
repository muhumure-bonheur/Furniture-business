import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/sanity/lib/queries";

export const metadata = { title: "Services", description: "Furniture supply, custom furniture, and space guidance from Hassan Furnitures." };

export default async function ServicesPage() {
  const settings = await getSiteSettings();
  const services = settings.services || [];
  return <div className="min-h-screen"><section className="border-b border-border bg-muted/25 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">How we can help</p><h1 className="mt-5 max-w-3xl font-display text-5xl leading-none tracking-[-0.055em] sm:text-7xl">Furniture, made around the way you live.</h1><p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">From a single considered piece to a complete room, our team can help you choose, adapt, or create furniture that fits.</p></div></section><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">{services.length ? <div className="grid gap-10 border-t border-border md:grid-cols-3">{services.map((service, index) => <div key={service._key || service.title} className="border-b border-border pt-6 md:border-b-0"><span className="text-sm text-muted-foreground">0{index + 1}</span><h2 className="mt-7 font-display text-3xl">{service.title}</h2><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{service.description}</p></div>)}</div> : <p className="border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Services will appear here once they are published in Sanity Studio.</p>}<Link href="/contacts" className="mt-16 inline-flex items-center gap-2 border border-foreground px-5 py-3 text-sm font-semibold">Talk to our team <ArrowRight className="size-4" /></Link></section></div>;
}
