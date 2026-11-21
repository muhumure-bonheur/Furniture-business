import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hassan Furnitures | Quality Furniture & Interior Solutions",
    template: "%s | Hassan Furnitures",
  },
  description:
    "Hassan Furnitures creates and supplies quality furniture designed to bring comfort, functionality, and style to homes, offices, and commercial spaces.",
  keywords: [
    "furniture",
    "home furniture",
    "office furniture",
    "custom furniture",
    "interior furniture",
  ],
  authors: [{ name: "Hassan Furnitures" }],
  openGraph: {
    title: "Hassan Furnitures | Quality Furniture & Interior Solutions",
    description:
      "Discover quality furniture and interior solutions designed for modern living and working spaces.",
    type: "website",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
