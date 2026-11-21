import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "./client") {
      return { url: "data:text/javascript,export const sanityClient = null;", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
const { getProducts, getCategories, getRecentProducts, getProductBySlug, getSiteSettings } = await import("../src/sanity/lib/queries.ts");
hooks.deregister();

test("an unconfigured project never serves sample content", async () => {
  for (const fetch of [getProducts, getCategories, getRecentProducts, getSiteSettings, () => getProductBySlug("cloud-modular-sofa")]) {
    await assert.rejects(fetch(), /Set NEXT_PUBLIC_SANITY_PROJECT_ID/);
  }
});
