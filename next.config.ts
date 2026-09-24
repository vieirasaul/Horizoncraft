import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: process.env.E2E_MODE === "true",
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
  async redirects() {
    return [
      {
        source: "/historias/:story/:chapter",
        destination: "/capitulos/:chapter",
        permanent: true,
      },
      {
        source: "/historias/:story",
        destination: "/capitulos",
        permanent: true,
      },
      {
        source: "/historias",
        destination: "/capitulos",
        permanent: true,
      },
      {
        source: "/capitulos/horizoncraft",
        destination: "/capitulos",
        permanent: true,
      },
      {
        source: "/capitulos/:story/:chapter",
        destination: "/capitulos/:chapter",
        permanent: true,
      },
    ];
  },
  webpack(config) {
    if (process.env.E2E_MODE === "true") {
      config.devtool = "source-map";
    }
    return config;
  },
};

export default nextConfig;
