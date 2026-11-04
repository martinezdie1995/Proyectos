import { connection } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { getPublishedRentalSlugs } from "@/lib/properties/public-rentals";

export default async function sitemap() {
  await connection();
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  const slugs = await getPublishedRentalSlugs();

  return [
    {
      url: siteUrl.toString(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/alquileres", siteUrl).toString(),
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...slugs.map((slug) => ({
      url: new URL(`/alquileres/${slug}`, siteUrl).toString(),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  ];
}
