export function optimizedImageUrl(source: string | undefined, width: number): string | undefined {
  if (!source) return undefined;
  if (!source.startsWith("http")) return source;

  try {
    const url = new URL(source);
    if (url.hostname !== "cdn.sanity.io") return source;
    url.searchParams.set("w", String(width));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  } catch {
    return source;
  }
}
