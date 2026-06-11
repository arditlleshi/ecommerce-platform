import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: now,
    },
    {
      url: new URL("/login", siteUrl).toString(),
      lastModified: now,
    },
    {
      url: new URL("/account", siteUrl).toString(),
      lastModified: now,
    },
  ];
}
