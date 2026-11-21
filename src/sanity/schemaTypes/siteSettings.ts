import { defineArrayMember, defineField, defineType } from "sanity";

const imageField = (name: string, title: string) =>
  defineField({ name, title, type: "image", description: "Upload a clear, relevant image for this section. Add alt text to describe it for accessibility.", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt text", type: "string", description: "Describe the image briefly. Example: Wooden furniture in a warm living room." }] });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "brandName", title: "Brand name", type: "string", description: "The business name shown in the navbar and footer. Example: Hassan Furnitures.", initialValue: "Hassan Furnitures", validation: (rule) => rule.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string", description: "A short sentence describing the business. Example: Furniture for the way you live." }),
    defineField({ name: "announcement", title: "Announcement bar", type: "string", description: "Optional short message shown at the top of every public page. Example: Made-to-order furniture, considered for everyday life." }),
    defineField({ name: "hero", title: "Homepage hero", type: "object", fields: [
      defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: "Small label above the main heading. Example: Furniture for the way you live." }),
      defineField({ name: "title", title: "Title", type: "string", description: "The main homepage headline. Keep it short and memorable. Example: Pieces with presence, made to be lived with." }),
      defineField({ name: "description", title: "Description", type: "text", description: "Two or three sentences explaining what the business offers and who it helps.", rows: 4 }),
      imageField("image", "Image"),
      defineField({ name: "ctaLabel", title: "CTA label", type: "string", description: "Text for the main homepage button. Example: Explore the collection." }),
    ] }),
    defineField({ name: "about", title: "About section", type: "object", fields: [
      defineField({ name: "heading", title: "Heading", type: "string", description: "A short heading describing the company approach. Example: A considered approach to furniture." }),
      defineField({ name: "description", title: "Description", type: "text", description: "Explain the company story, values, materials, or approach in a few sentences.", rows: 5 }),
      imageField("image", "Image"),
    ] }),
    defineField({ name: "services", title: "Services", type: "array", description: "Add the services customers can request. Example: Furniture supply, Custom furniture, Space guidance.", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "title", title: "Title", type: "string", description: "The service name. Example: Custom furniture.", validation: (rule) => rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", description: "Briefly explain what the service includes.", rows: 3 }),
    ] })] }),
    defineField({ name: "contact", title: "Contact details", type: "object", fields: [
      defineField({ name: "phone", title: "Phone", type: "string", description: "Public business phone number, including area or country code if appropriate." }),
      defineField({ name: "email", title: "Email", type: "string", description: "Public business email address customers can use." }),
      defineField({ name: "address", title: "Address", type: "text", description: "Public showroom or business address. Use line breaks for readability.", rows: 3 }),
      defineField({ name: "hours", title: "Opening hours", type: "text", description: "Public opening hours. Example: Monday–Friday: 08:00–17:00\nSaturday: 09:00–13:00.", rows: 3 }),
    ] }),
    defineField({ name: "socialLinks", title: "Social links", type: "array", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "label", title: "Label", type: "string", description: "Name shown for the link. Examples: Instagram, Facebook, Pinterest.", validation: (rule) => rule.required() }),
      defineField({ name: "url", title: "URL", type: "url", description: "Paste the complete public URL, including https://.", validation: (rule) => rule.required() }),
    ] })] }),
  ],
  preview: { select: { title: "brandName", subtitle: "tagline" } },
});
