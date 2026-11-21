import assert from "node:assert/strict";
import test from "node:test";
import { optimizedImageUrl } from "../src/lib/image.ts";
import { getProductInquiry, getTelephoneHref, getWhatsAppHref, normalizePhoneNumber, validatePhoneNumber } from "../src/lib/whatsapp.ts";

test("local images and missing images work without Sanity", () => {
  assert.equal(optimizedImageUrl("/images/1.jpeg", 900), "/images/1.jpeg");
  assert.equal(optimizedImageUrl(undefined, 900), undefined);
});

test("Sanity images receive resize parameters while retaining existing parameters", () => {
  const url = new URL(optimizedImageUrl("https://cdn.sanity.io/images/project/production/image.jpg?rect=1,2,3,4&w=100", 900));
  assert.equal(url.searchParams.get("w"), "900");
  assert.equal(url.searchParams.get("auto"), "format");
  assert.equal(url.searchParams.get("fit"), "max");
  assert.equal(url.searchParams.get("rect"), "1,2,3,4");
});

test("image helper leaves unrelated hosts unchanged", () => {
  const source = "https://example.com/image.jpg";
  assert.equal(optimizedImageUrl(source, 900), source);
});

test("WhatsApp enquiries use the separate Sanity number and encode product names", () => {
  const message = getProductInquiry("Oak & Linen #1", "R 8,900");
  const url = new URL(getWhatsAppHref(message, { phone: "+27 11 123 4567", whatsappNumber: "+27 (82) 123-4567" }));
  assert.equal(url.pathname, "/27821234567");
  assert.equal(url.searchParams.get("text"), message);
  assert.match(message, /Oak & Linen #1/);
  assert.match(message, /R 8,900/);
});

test("blank or invalid separate WhatsApp numbers fall back to the telephone number", () => {
  for (const whatsappNumber of [undefined, "", "   ", "not a number"]) {
    const url = new URL(getWhatsAppHref("Hello", { phone: "+27 82 123 4567", whatsappNumber }));
    assert.equal(url.pathname, "/27821234567");
  }
});

test("missing or invalid contact settings never produce an enquiry link", () => {
  for (const contact of [undefined, {}, { phone: "" }, { phone: "0821234567" }, { phone: "invalid", whatsappNumber: "123" }]) {
    assert.equal(getWhatsAppHref("Hello", contact), undefined);
  }
  assert.equal(getTelephoneHref(), undefined);
  assert.equal(getTelephoneHref("bad value"), undefined);
});

test("telephone links preserve the country code while the displayed number can stay formatted", () => {
  assert.equal(getTelephoneHref(" +27 (82) 123-4567 "), "tel:+27821234567");
  assert.equal(getTelephoneHref("0027 82 123 4567"), "tel:+27821234567");
});

test("Sanity validation permits optional fields and formatted international numbers", () => {
  for (const value of [undefined, "", "   ", "+27 (82) 123-4567", "27821234567", "0027821234567"]) {
    assert.equal(validatePhoneNumber(value), true);
  }
});

test("validation and runtime reject local numbers, extensions, URLs, and invalid lengths", () => {
  for (const value of ["0821234567", "123", "1234567890123456", "+27 82 123 4567 ext 1", "https://wa.me/27821234567", "+27+821234567", "letters", "---"]) {
    assert.equal(normalizePhoneNumber(value), undefined, value);
    assert.equal(typeof validatePhoneNumber(value), "string", value);
  }
});

test("publishing a replacement number changes generated links without reloading a module", () => {
  assert.equal(new URL(getWhatsAppHref("Hello", { phone: "+27 82 123 4567" })).pathname, "/27821234567");
  assert.equal(new URL(getWhatsAppHref("Hello", { phone: "+27 83 765 4321" })).pathname, "/27837654321");
});

test("WhatsApp can be configured without a telephone number", () => {
  assert.equal(new URL(getWhatsAppHref("Hello", { whatsappNumber: "+27 82 123 4567" })).pathname, "/27821234567");
});
