import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloud Shell's web preview domain for HMR (Hot Module Replacement)
  allowedDevOrigins: [
    '3000-cs-199870033145-default.cs-europe-west1-haha.cloudshell.dev',
    '8080-cs-199870033145-default.cs-europe-west1-haha.cloudshell.dev',
    '3000-cs-199870033145-default.cs-europe-west1-onse.cloudshell.dev'
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
