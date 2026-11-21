import type { ContactDetails } from "../sanity/types";

export function normalizePhoneNumber(value?: string): string | undefined {
  if (!value || !/^\+?[\d\s().-]+$/.test(value.trim())) return undefined;
  const digits = value.replace(/[\s().+-]/g, "").replace(/^00/, "");
  return /^[1-9]\d{6,14}$/.test(digits) ? digits : undefined;
}

export function validatePhoneNumber(value?: string): true | string {
  if (!value?.trim() || normalizePhoneNumber(value)) return true;
  return "Include the country code and 7–15 digits, for example +27 82 123 4567. Do not include extensions.";
}

export function getTelephoneHref(phone?: string): string | undefined {
  const number = normalizePhoneNumber(phone);
  return number ? `tel:+${number}` : undefined;
}

export function getWhatsAppHref(message: string, contact?: ContactDetails): string | undefined {
  const number = normalizePhoneNumber(contact?.whatsappNumber) || normalizePhoneNumber(contact?.phone);
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : undefined;
}

export function getProductInquiry(productName: string, priceDisplay?: string): string {
  const price = priceDisplay ? ` I would also like to confirm the current price (${priceDisplay}).` : "";
  return `Hello Hassan Furnitures, I am interested in the ${productName}.${price} Could you please provide more information about availability and lead time?`;
}
