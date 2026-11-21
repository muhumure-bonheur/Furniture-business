import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Name", type: "string", description: "The category name customers will see. Examples: Sofas, Dining Tables, Office Furniture.", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", description: "Enter the name above, then click Generate. Example: dining-tables.", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Short description", type: "text", description: "A short sentence explaining the category. Example: Comfortable seating for living rooms and family spaces.", rows: 3 }),
    defineField({ name: "image", title: "Category image", type: "image", description: "Optional image used when browsing categories. Choose a photo that represents the whole category.", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt text", type: "string", description: "Describe the image briefly, for example: Neutral fabric sofas in a modern living room." }] }),
    defineField({ name: "order", title: "Display order", type: "number", description: "Optional ordering for category cards. Smaller numbers appear first.", initialValue: 0 }),
  ],
  preview: { select: { title: "title", media: "image" } },
});
