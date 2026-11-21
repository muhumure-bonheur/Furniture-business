import { existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { planSampleSeed, sampleImagePath, seedSampleContent } from "./lib/sample-seed.mjs";

// Match the app's local environment precedence. Shell variables take priority.
for (const name of [".env.local", ".env"]) {
  const file = new URL(`../${name}`, import.meta.url);
  if (existsSync(file)) loadEnvFile(file);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => !["--write", "--dry-run"].includes(arg)) || (args.includes("--write") && args.includes("--dry-run"))) {
    throw new Error("Usage: node scripts/seed-sanity.mjs [--dry-run | --write]");
  }
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
  if (!projectId || !/^[a-z0-9]+$/.test(projectId)) {
    throw new Error("Set a real NEXT_PUBLIC_SANITY_PROJECT_ID in .env or .env.local. A blank .env.local value overrides .env.");
  }
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(dataset)) throw new Error("Invalid Sanity dataset name.");
  console.log(`Sanity target: project ${projectId}, dataset ${dataset}`);

  if (!args.includes("--write")) {
    const plan = planSampleSeed();
    for (const source of plan.imageSources) {
      if (!(await stat(sampleImagePath(source))).isFile()) throw new Error(`Missing sample image: ${source}`);
    }
    console.log(`DRY RUN: up to ${plan.categories.length} categories, ${plan.products.length} products, 1 site settings document, and ${plan.imageSources.length} unique images.`);
    console.log("No network requests or writes made. Existing content will be checked and skipped during --write.");
    return;
  }

  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!token) throw new Error("Set SANITY_API_WRITE_TOKEN to a Sanity token with write permission, then rerun with --write. Never use a NEXT_PUBLIC_ variable for this token.");
  const { createClient } = await import("next-sanity");
  const client = createClient({ projectId, dataset, token, apiVersion: "2025-01-01", useCdn: false, perspective: "raw" });
  await seedSampleContent(client);
}

main().catch((error) => {
  // Avoid dumping client request objects, headers, or credentials.
  console.error(`Seed failed: ${error.message}`);
  process.exitCode = 1;
});
