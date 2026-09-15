import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
