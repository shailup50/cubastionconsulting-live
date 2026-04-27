const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "localhost",
        pathname: "/BackEndImage/**",
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/cubastion-api/:path*",
        destination: "https://cubastionapi.cyralix.com/api/v1/:path*",
      },
      {
        source: "/OnlineImages/:path*",
        destination: "https://localhost:7093/OnlineImages/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://cubastionapi.cyralix.com/api/v1/:path*",
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
