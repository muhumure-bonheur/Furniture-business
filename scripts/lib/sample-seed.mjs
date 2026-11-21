import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { sampleCategories, sampleProducts, sampleSiteSettings } from "../data/sample-content.ts";

const publicDirectory = new URL("../../public/", import.meta.url);
const categoryId = (category) => `sample-category-${category.slug}`;
const productId = (product) => `sample-product-${product.slug}`;
const settingsId = "sample-site-settings";

function findExisting(existing, type, id, slug) {
  const matches = existing.filter((doc) => doc._type === type && (
    doc._id === id || doc._id === `drafts.${id}` || (slug && doc.slug === slug)
  ));
  return matches.find((doc) => !doc._id.startsWith("drafts.")) || matches[0];
}

export function planSampleSeed(existing = []) {
  const categories = sampleCategories.map((sample, order) => {
    const found = findExisting(existing, "category", categoryId(sample), sample.slug);
    return { sample, order, id: found?._id || categoryId(sample), create: !found };
  });
  const products = sampleProducts.filter((sample) => !findExisting(existing, "product", productId(sample), sample.slug));
  const createSettings = !existing.some((doc) => doc._type === "siteSettings");

  for (const sample of products) {
    const category = categories.find((item) => item.sample._id === sample.category?._id);
    if (!category || category.id.startsWith("drafts.")) {
      throw new Error(`Publish the existing category for "${sample.name}" before seeding products.`);
    }
  }

  const imageSources = new Set(products.flatMap((sample) => [sample.imageUrl, ...(sample.additionalImages || []).map((image) => image.url)]));
  if (createSettings) {
    imageSources.add(sampleSiteSettings.hero?.imageUrl);
    imageSources.add(sampleSiteSettings.about?.imageUrl);
  }
  imageSources.delete(undefined);
  return { categories, products, createSettings, imageSources: [...imageSources] };
}

export function sampleImagePath(source) {
  if (!/^\/images\/[\w.-]+\.(?:jpe?g|png|webp)$/i.test(source)) {
    throw new Error(`Unsupported local sample image: ${source}`);
  }
  return fileURLToPath(new URL(source.slice(1), publicDirectory));
}

export function buildSampleDocuments(plan, uploadedImages) {
  function image(source, alt) {
    if (!source) return undefined;
    const assetId = uploadedImages.get(source);
    if (!assetId) throw new Error(`No uploaded asset for ${source}`);
    return { _type: "image", asset: { _type: "reference", _ref: assetId }, alt };
  }

  const categories = plan.categories.filter((item) => item.create).map(({ sample, order, id }) => ({
    _id: id,
    _type: "category",
    title: sample.title,
    slug: { _type: "slug", current: sample.slug },
    description: sample.description,
    order,
  }));

  const products = plan.products.map((sample) => ({
    _id: productId(sample),
    _type: "product",
    name: sample.name,
    slug: { _type: "slug", current: sample.slug },
    description: sample.description,
    priceDisplay: sample.priceDisplay,
    category: { _type: "reference", _ref: plan.categories.find((item) => item.sample._id === sample.category?._id).id },
    mainImage: image(sample.imageUrl, sample.imageAlt || sample.name),
    additionalImages: (sample.additionalImages || []).map((item, index) => ({ ...image(item.url, item.alt || sample.name), _key: `photo-${index}` })),
    availability: sample.availability,
    dimensions: sample.dimensions,
    materials: sample.materials,
    colors: sample.colors,
    order: sample.order,
  }));

  const documents = [...categories, ...products];
  if (plan.createSettings) {
    const { hero, about, services, ...settings } = sampleSiteSettings;
    const { imageUrl: heroUrl, imageAlt: heroAlt, ...heroFields } = hero;
    const { imageUrl: aboutUrl, imageAlt: aboutAlt, ...aboutFields } = about;
    documents.push({
      _id: settingsId,
      _type: "siteSettings",
      ...settings,
      hero: { ...heroFields, image: image(heroUrl, heroAlt) },
      about: { ...aboutFields, image: image(aboutUrl, aboutAlt) },
      services: services.map((service, index) => ({ ...service, _key: `service-${index}` })),
    });
  }
  return documents;
}

export async function seedSampleContent(client, { log = console.log } = {}) {
  const existing = await client.fetch(
    '*[_type in ["category", "product", "siteSettings"] && !(_id in path("versions.**"))]{_id, _type, "slug": slug.current}',
  );
  const plan = planSampleSeed(existing);
  // Validate every path before uploading any image.
  for (const source of plan.imageSources) {
    if (!(await stat(sampleImagePath(source))).isFile()) throw new Error(`Sample image is not a file: ${source}`);
  }

  const uploadedImages = new Map();
  for (const source of plan.imageSources) {
    const asset = await client.assets.upload("image", await readFile(sampleImagePath(source)), {
      filename: source.split("/").at(-1),
    });
    uploadedImages.set(source, asset._id);
    log(`Uploaded ${source}`);
  }

  const documents = buildSampleDocuments(plan, uploadedImages);
  if (!documents.length) {
    log("No new samples to create. Existing content was preserved.");
    return [];
  }
  let transaction = client.transaction();
  for (const document of documents) transaction = transaction.createIfNotExists(document);
  await transaction.commit();
  log(`Created up to ${documents.length} published sample documents. Existing content was preserved.`);
  return documents;
}
