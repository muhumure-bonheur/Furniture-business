import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSiteSettings } from "@/sanity/lib/queries";
import { getTelephoneHref, getWhatsAppHref } from "@/lib/whatsapp";

export const metadata = {
  title: "Contact Hassan Furnitures",
  description:
    "Contact Hassan Furnitures about furniture, custom pieces, availability, and lead times.",
};

export default async function ContactsPage() {
  const settings = await getSiteSettings();
  const contact = settings.contact;
  const telephoneHref = getTelephoneHref(contact?.phone);
  const whatsappHref = getWhatsAppHref(
    `Hello ${settings.brandName}, I would like to make an inquiry.`,
    contact,
  );
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/25 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Start a conversation
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-none tracking-[-0.055em] sm:text-7xl">
            Let&apos;s talk about your space.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">
            Tell us what you are looking for and our team will help with product
            information, availability, or a custom furniture enquiry.
          </p>
          {whatsappHref && <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex items-center gap-2 bg-[#25D366] px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-[#25D366]/85"
          >
            <MessageCircle className="size-4" /> Chat on WhatsApp
          </a>}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8 lg:py-24">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Contact details
          </p>
          <h2 className="mt-4 font-display text-3xl">
            We&apos;re here to help.
          </h2>
          <div className="mt-8 grid gap-6 text-sm">
            {telephoneHref && (
              <a
                href={telephoneHref}
                className="flex items-start gap-3 hover:underline"
              >
                <Phone className="mt-0.5 size-5 shrink-0" />
                <span>{contact?.phone}</span>
              </a>
            )}
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-start gap-3 hover:underline"
              >
                <Mail className="mt-0.5 size-5 shrink-0" />
                <span>{contact.email}</span>
              </a>
            )}
            {contact?.address && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0" />
                <span className="whitespace-pre-line text-muted-foreground">
                  {contact.address}
                </span>
              </div>
            )}
            {contact?.hours && (
              <div className="border-t border-border pt-5">
                <p className="font-semibold">Opening hours</p>
                <p className="mt-2 whitespace-pre-line text-muted-foreground">
                  {contact.hours}
                </p>
              </div>
            )}
            {!telephoneHref && !whatsappHref && !contact?.email && !contact?.address && (
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                Contact details are not available yet. Please check back soon.
              </p>
            )}
          </div>
        </div>
        <div className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Useful links
          </p>
          <div className="mt-6 grid gap-1">
            {[
              ["Explore furniture", "/products"],
              ["Learn about us", "/about"],
              ["View services", "/services"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between border-b border-border py-5 font-display text-2xl hover:text-muted-foreground"
              >
                {label}
                <ArrowUpRight className="size-5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
