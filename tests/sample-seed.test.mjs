import assert from "node:assert/strict";
import test from "node:test";
import { buildSampleDocuments, planSampleSeed, sampleImagePath, seedSampleContent } from "../scripts/lib/sample-seed.mjs";

test("sample documents match the CMS schema and reference uploaded image assets", () => {
  const plan = planSampleSeed();
  const images = new Map(plan.imageSources.map((source, index) => [source, `image-test${index}-100x100-jpg`]));
  const docs = buildSampleDocuments(plan, images);
  assert.equal(docs.length, 13);
  assert.equal(plan.imageSources.length, 6);
  const ids = new Set(docs.map((doc) => doc._id));
  for (const product of docs.filter((doc) => doc._type === "product")) {
    assert.equal(product.slug._type, "slug");
    assert.ok(ids.has(product.category._ref));
    assert.equal(product.mainImage._type, "image");
    assert.ok(product.mainImage.asset._ref.startsWith("image-test"));
    assert.ok(product.mainImage.alt);
    assert.equal(product.imageUrl, undefined);
  }
  const settings = docs.find((doc) => doc._type === "siteSettings");
  assert.ok(settings.hero.image.asset._ref);
  assert.ok(settings.about.image.asset._ref);
  assert.ok(settings.services.every((service) => service._key));
  assert.equal(settings.contact, undefined, "Do not invent business contact details");
});

test("existing category slugs are reused and existing products and settings are preserved", () => {
  const plan = planSampleSeed([
    { _id: "owner-sofas", _type: "category", slug: "sofas" },
    { _id: "owner-sofa", _type: "product", slug: "cloud-modular-sofa" },
    { _id: "owner-settings", _type: "siteSettings" },
  ]);
  assert.equal(plan.categories.find((item) => item.sample.slug === "sofas").id, "owner-sofas");
  assert.equal(plan.categories.find((item) => item.sample.slug === "sofas").create, false);
  assert.equal(plan.products.some((item) => item.slug === "cloud-modular-sofa"), false);
  assert.equal(plan.createSettings, false);
});

test("reruns preserve seeded documents even if their slugs have been edited", () => {
  const plan = planSampleSeed([{ _id: "sample-product-cloud-modular-sofa", _type: "product", slug: "renamed" }]);
  assert.equal(plan.products.some((item) => item.slug === "cloud-modular-sofa"), false);
});

test("draft products and site settings are not replaced or published", () => {
  const plan = planSampleSeed([
    { _id: "drafts.owner-product", _type: "product", slug: "cloud-modular-sofa" },
    { _id: "drafts.owner-settings", _type: "siteSettings" },
  ]);
  assert.equal(plan.products.length, 5);
  assert.equal(plan.createSettings, false);
});

test("draft-only categories block seeding before uploads instead of creating broken references", () => {
  assert.throws(() => planSampleSeed([
    { _id: "drafts.owner-sofas", _type: "category", slug: "sofas" },
  ]), /Publish the existing category/);
});

test("sample image paths cannot escape the local image folder", () => {
  for (const source of ["/../.env", "/images/../../.env", "https://example.com/image.jpg", "/images/a/b.jpg"]) {
    assert.throws(() => sampleImagePath(source), /Unsupported/);
  }
});

test("the seed uploads six unique images, commits documents atomically, and becomes a no-op on rerun", async () => {
  const stored = [];
  let uploads = 0;
  let commits = 0;
  const client = {
    fetch: async () => stored.map((doc) => ({ ...doc, slug: doc.slug?.current })),
    assets: { upload: async (type, bytes) => {
      assert.equal(type, "image");
      assert.ok(bytes.length > 0);
      uploads++;
      return { _id: `image-test${uploads}-100x100-jpg` };
    } },
    transaction() {
      const pending = [];
      return {
        createIfNotExists(doc) { pending.push(doc); return this; },
        async commit() { stored.push(...pending); commits++; },
      };
    },
  };
  const options = { log() {} };
  await seedSampleContent(client, options);
  assert.equal(uploads, 6);
  assert.equal(commits, 1);
  assert.equal(stored.length, 13);
  await seedSampleContent(client, options);
  assert.equal(uploads, 6);
  assert.equal(commits, 1);
  assert.equal(stored.length, 13);
});

test("an upload failure never commits partially seeded documents", async () => {
  const client = {
    fetch: async () => [],
    assets: { upload: async () => { throw new Error("Upload failed"); } },
    transaction() { assert.fail("No transaction should start after a failed upload"); },
  };
  await assert.rejects(seedSampleContent(client, { log() {} }), /Upload failed/);
});
