/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseImagePattern = supabaseUrl
  ? (() => {
      const url = new URL(supabaseUrl);
      return {
        protocol: url.protocol.slice(0, -1),
        hostname: url.hostname,
        port: url.port,
        pathname: "/storage/v1/object/sign/property-images/**",
      };
    })()
  : null;

const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: supabaseImagePattern ? [supabaseImagePattern] : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
