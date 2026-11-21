import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { getTelephoneHref, getWhatsAppHref } from "../src/lib/whatsapp.ts";

let fetchContent = async () => null;
globalThis.__hassanTestClient = { fetch: (...args) => fetchContent(...args) };
const clientModule = `data:text/javascript,${encodeURIComponent("export const createClient = () => globalThis.__hassanTestClient;")}`;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    const mappings = {
      "next-sanity": clientModule,
      "./client": new URL("../src/sanity/lib/client.ts", import.meta.url).href,
    };
    if (mappings[specifier]) return { url: mappings[specifier], shortCircuit: true };
    return nextResolve(specifier, context);
  },
});

const previous = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "testproject";
const { getProducts, getCategories, getProductBySlug, getRecentProducts, getSiteSettings } = await import("../src/sanity/lib/queries.ts");
if (previous === undefined) delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
else process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = previous;
hooks.deregister();

test("missing Sanity content never becomes sample content", async () => {
  fetchContent = async () => null;
  assert.deepEqual(await getProducts(), []);
  assert.deepEqual(await getCategories(), []);
  assert.deepEqual(await getRecentProducts(), []);
  await assert.rejects(getSiteSettings(), /Publish a Site settings document/);
  assert.equal(await getProductBySlug("does-not-exist"), null);
});

test("an intentionally empty published catalogue stays empty", async () => {
  fetchContent = async () => [];
  assert.deepEqual(await getProducts(), []);
  assert.deepEqual(await getCategories(), []);
  assert.deepEqual(await getRecentProducts(), []);
});

test("published contact settings feed telephone and WhatsApp links, including later edits", async () => {
  let contact = { phone: "+27 11 123 4567", whatsappNumber: "+27 82 123 4567" };
  fetchContent = async (query) => {
    assert.match(query, /\bcontact\b/);
    return { brandName: "Hassan Furnitures", contact };
  };
  let settings = await getSiteSettings();
  assert.equal(getTelephoneHref(settings.contact.phone), "tel:+27111234567");
  assert.equal(new URL(getWhatsAppHref("Hello", settings.contact)).pathname, "/27821234567");
  contact = { phone: "+27 83 765 4321" };
  settings = await getSiteSettings();
  assert.equal(new URL(getWhatsAppHref("Hello", settings.contact)).pathname, "/27837654321");
});

test("recent products preserve newest-first server ordering", async () => {
  const products = ["newest", "second", "third", "fourth"].map((_id) => ({ _id }));
  fetchContent = async () => products;
  assert.deepEqual(await getRecentProducts(), products.slice(0, 3));
});

test("product lookups bind the slug as a query parameter", async () => {
  const slug = 'oak" || true';
  fetchContent = async (query, params) => {
    assert.match(query, /slug\.current == \$slug/);
    assert.equal(params.slug, slug);
    assert.equal(query.includes(slug), false);
    return null;
  };
  assert.equal(await getProductBySlug(slug), null);
});

test("a Sanity outage is reported instead of displaying a sample catalogue", async () => {
  fetchContent = async () => { throw new Error("Simulated CMS outage"); };
  for (const fetch of [getProducts, getCategories, getRecentProducts, getSiteSettings, () => getProductBySlug("cloud-modular-sofa")]) {
    await assert.rejects(fetch(), /Simulated CMS outage/);
  }
});

test("incomplete site settings require publication instead of using a sample brand", async () => {
  for (const settings of [{}, { brandName: "   " }]) {
    fetchContent = async () => settings;
    await assert.rejects(getSiteSettings(), /Publish a Site settings document/);
  }
});
