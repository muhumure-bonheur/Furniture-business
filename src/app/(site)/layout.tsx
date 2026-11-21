import { NavBar } from "@/components/custom/NavBar";
import { Footer } from "@/components/custom/Footer";
import { getCategories, getSiteSettings } from "@/sanity/lib/queries";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, categories] = await Promise.all([getSiteSettings(), getCategories()]);

  return (
    <>
      <NavBar
        brandName={siteSettings.brandName}
        announcement={siteSettings.announcement}
        categories={categories}
        contact={siteSettings.contact}
      />

      <main>{children}</main>

      <Footer siteSettings={siteSettings} categories={categories} />
    </>
  );
}
