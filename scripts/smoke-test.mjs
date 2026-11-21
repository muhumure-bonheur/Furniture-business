import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";

async function check(path, status = 200, expectedText) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(120_000) });
  assert.equal(response.status, status, `${path}: unexpected HTTP status`);
  const body = await response.text();
  if (expectedText) assert.ok(body.includes(expectedText), `${path}: missing expected content`);
  for (const [, href] of body.matchAll(/href="(https:\/\/wa\.me\/[^"]*)"/g)) {
    const url = new URL(href.replaceAll("&amp;", "&"));
    assert.match(url.pathname, /^\/[1-9]\d{6,14}$/, `${path}: invalid WhatsApp recipient`);
    assert.ok(url.searchParams.get("text"), `${path}: missing enquiry message`);
  }
  console.log(`PASS ${status} ${path}`);
  return body;
}

try {
  const home = await check("/");
  const catalogue = await check("/products", 200, "Search furniture");
  await check("/products?category=unknown-smoke-test-category", 200, "No furniture found");
  await check("/about");
  await check("/services");
  await check("/contacts");
  await check("/studio");
  await check("/robots.txt", 200, "sitemap.xml");
  await check("/sitemap.xml", 200, "/products");
  await check("/products/nonexistent-smoke-test-product", 404);
  await check("/nonexistent-smoke-test-page", 404);

  const productPath = catalogue.match(/href="(\/products\/[^"?#]+)"/)?.[1];
  if (productPath) {
    await check(productPath, 200, "Back to furniture");
  } else {
    console.log("SKIP product detail: catalogue is empty");
  }

  const imagePath = home.match(/src="(\/_next\/image\?[^\"]+)"/)?.[1];
  if (imagePath) {
    const optimized = await fetch(new URL(imagePath.replaceAll("&amp;", "&"), base));
    assert.equal(optimized.status, 200, "Published image optimisation failed");
    assert.match(optimized.headers.get("content-type") || "", /^image\//);
    await optimized.arrayBuffer();
    console.log("PASS published image optimisation");
  } else {
    console.log("SKIP image optimisation: homepage has no published images");
  }
  console.log("HTTP smoke checks passed. Browser interactions require a separate check.");
} catch (error) {
  console.error(`Smoke check failed at ${base}:`, error.message);
  process.exitCode = 1;
}
