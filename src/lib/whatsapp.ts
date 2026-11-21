const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

export function getWhatsAppHref(message: string): string {
  const base = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getProductInquiry(productName: string, priceDisplay?: string): string {
  const price = priceDisplay ? ` I would also like to confirm the current price (${priceDisplay}).` : "";
  return `Hello Hassan Furnitures, I am interested in the ${productName}.${price} Could you please provide more information about availability and lead time?`;
}

export function hasWhatsAppNumber(): boolean {
  return Boolean(whatsappNumber);
}
