import assert from "node:assert/strict";
import test from "node:test";
import { filterProducts } from "../src/lib/catalog.ts";

const products = [
  { _id: "sofa", name: "Zuri Sofa", slug: "zuri", description: "Deep cushions", category: { _id: "sofas", title: "Sofas", slug: "sofas" }, materials: ["Linen"], colors: ["Sand"] },
  { _id: "table", name: "Ash Table", slug: "ash", description: "For shared meals", category: { _id: "tables", title: "Tables", slug: "tables" }, materials: ["Oak"] },
  { _id: "chair", name: "Reading Chair", slug: "chair", description: "A quiet corner" },
];

test("catalogue combines category and case-insensitive material search", () => {
  assert.deepEqual(filterProducts(products, "SOFAS", "  LINEN  ", "recent").map((item) => item._id), ["sofa"]);
  assert.deepEqual(filterProducts(products, "tables", "linen", "recent"), []);
});

test("search matches colours, descriptions, and category names", () => {
  for (const search of ["sand", "deep cushions", "sofas"]) {
    assert.deepEqual(filterProducts(products, "all", search, "recent").map((item) => item._id), ["sofa"]);
  }
});

test("clearing filters restores all products, including uncategorised pieces", () => {
  assert.deepEqual(filterProducts(products, "all", "", "recent"), products);
  assert.deepEqual(filterProducts(products, "missing", "", "recent"), []);
});

test("name sorting preserves source order for subsequent Recent sorting", () => {
  assert.deepEqual(filterProducts(products, "all", "", "name").map((item) => item._id), ["table", "chair", "sofa"]);
  assert.deepEqual(filterProducts(products, "all", "", "recent").map((item) => item._id), ["sofa", "table", "chair"]);
});
