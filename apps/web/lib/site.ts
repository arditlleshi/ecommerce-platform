export const siteConfig = {
  name: "Ecommerce Platform",
  description:
    "A shadcn-first storefront shell with auth-aware entry, newsletter capture, and account flow.",
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
