import { getSiteUrl } from "@/lib/site-url";

export default function robots() {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl.host,
  };
}
