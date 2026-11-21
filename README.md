# Hassan Furnitures

Hassan Furnitures is a Next.js App Router website for browsing furniture and starting enquiries through WhatsApp. It is intentionally not an e-commerce application: there is no cart, checkout, account system, or online payment flow.

## Local setup

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Open `http://localhost:3000` (or the port reported by Next.js).

The site includes development fallback content and local images so it can run before Sanity is configured. Production content should be created in Sanity.

## Environment variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID.
- `NEXT_PUBLIC_SANITY_DATASET` — usually `production`.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — business number with country code and digits only, for example `27821234567`.
- `NEXT_PUBLIC_SITE_URL` — canonical deployed URL, used by metadata, sitemap, and robots.

## Sanity Studio

The embedded Studio is available at `/studio`. The schema includes:

- `Furniture product` — images, description, price display, category, availability, featured flag, dimensions, materials, colours, and display order.
- `Category` — manageable furniture categories, descriptions, imagery, and ordering.
- `Site settings` — hero, about section, services, contact details, announcement bar, tagline, and social links.

After setting the Sanity environment variables, authenticate and deploy the Studio with the Sanity CLI as needed:

```bash
pnpm sanity login
pnpm sanity deploy
```

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Architecture notes

- Server Components fetch published Sanity content through `src/sanity/lib/queries.ts`.
- Client Components are limited to catalog filtering, mobile navigation, and the product image gallery.
- Sanity image URLs are resized through CDN query parameters and rendered with `next/image`.
- Product and general enquiry messages are generated in `src/lib/whatsapp.ts`.
- `src/data/products.ts` is only a local fallback for development when Sanity variables/documents are unavailable.
