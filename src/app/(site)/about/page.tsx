import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { optimizedImageUrl } from "@/lib/image";
import { getSiteSettings } from "@/sanity/lib/queries";

export const metadata = { title: "About Hassan Furnitures", description: "Learn more about Hassan Furnitures and our approach to considered, useful furniture." };

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const about = settings.about;
  return <div className="min-h-screen"><section className="border-b border-border bg-muted/25 px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28"><div className="mx-auto max-w-3xl"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">About {settings.brandName}</p><h1 className="mt-5 font-display text-5xl leading-none tracking-[-0.055em] sm:text-7xl">Furniture with a point of view.</h1><p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground">{settings.tagline}</p></div></section><section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8 lg:py-28"><div className="relative aspect-[4/3] overflow-hidden bg-muted">{optimizedImageUrl(about?.imageUrl, 1200) ? <Image src={optimizedImageUrl(about?.imageUrl, 1200)!} alt={about?.imageAlt || "Hassan Furnitures"} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /> : <div className="grid h-full place-items-center text-sm text-muted-foreground">Image coming soon</div>}</div><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Our approach</p><h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em]">{about?.heading}</h2><p className="mt-6 text-base leading-7 text-muted-foreground">{about?.description}</p><Link href="/services" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">See our services <ArrowRight className="size-4" /></Link></div></section></div>;
}
