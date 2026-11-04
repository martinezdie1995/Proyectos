export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const deploymentHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const urlValue =
    configuredUrl ||
    (deploymentHost
      ? `https://${deploymentHost}`
      : "http://localhost:3000");
  const url = new URL(urlValue);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("NEXT_PUBLIC_SITE_URL debe usar HTTP o HTTPS.");
  }

  return new URL("/", url);
}
