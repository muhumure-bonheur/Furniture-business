import { defineArrayMember, defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Furniture product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", description: "The customer-facing product name. Example: Oslo 3-Seater Sofa.", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", description: "The URL name for this product. Enter the name above, then click Generate. Example: oslo-3-seater-sofa.", options: { source: "name", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", description: "Explain what makes the piece useful or distinctive in 1–3 short paragraphs. Example: A generous sofa with deep cushions for relaxed everyday living.", rows: 5, validation: (rule) => rule.required() }),
    defineField({ name: "priceDisplay", title: "Price display", type: "string", description: "Write exactly what customers should see. Examples: From R 12,500, R 8,900, or Price on request." }),
    defineField({ name: "category", title: "Category", type: "reference", description: "Choose an existing category. Create the category first if it is not listed.", to: [{ type: "category" }], validation: (rule) => rule.required() }),
    defineField({ name: "mainImage", title: "Main image", type: "image", description: "Upload the best primary photo of this product. Use a clear, well-lit image and set useful alt text below.", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt text", type: "string", description: "Describe the image for accessibility. Example: Beige 3-seater sofa in a bright living room.", validation: (rule) => rule.required() }], validation: (rule) => rule.required() }),
    defineField({ name: "additionalImages", title: "Additional images", type: "array", description: "Optional supporting photos: detail shots, alternate angles, colours, or the product in a room.", of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt text", type: "string", description: "Briefly describe what this image shows." }] })] }),
    defineField({ name: "availability", title: "Availability", type: "string", description: "Available products appear in the catalogue. Use Unavailable to hide a product from catalogue listings without deleting it.", options: { list: [{ title: "Available", value: "available" }, { title: "Made to order", value: "made-to-order" }, { title: "Unavailable", value: "unavailable" }], layout: "radio" }, initialValue: "available", validation: (rule) => rule.required() }),
    defineField({ name: "dimensions", title: "Dimensions", type: "string", description: "Include units and the key measurements. Example: 220cm W × 95cm D × 82cm H." }),
    defineField({ name: "materials", title: "Materials", type: "array", description: "Add one material per item. Examples: Solid oak, Linen upholstery, Powder-coated steel.", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "colors", title: "Colours / variants", type: "array", description: "Add each available colour or variant separately. Examples: Natural oak, Charcoal, Sand, Custom colour.", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "order", title: "Display order", type: "number", description: "Optional catalogue ordering. Smaller numbers appear first; use 1, 2, 3, and so on.", initialValue: 0 }),
  ],
  preview: { select: { title: "name", subtitle: "category.title", media: "mainImage" } },
});
