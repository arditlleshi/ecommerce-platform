export const siteConfig = {
  name: "Northstar Commerce",
  description:
    "A modern ecommerce storefront prototype with category navigation, search, curated products, and service-led merchandising.",
} as const;

export function getSiteUrl(): URL {
  const siteUrl =
    process.env.FRONTEND_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "http://localhost:3000";

  try {
    return new URL(siteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}
