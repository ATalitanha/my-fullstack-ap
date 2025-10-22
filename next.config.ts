import { Configuration } from "webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: Configuration) => {
    config.externals = [...(config.externals || []), ".prisma/client"];
    return config;
  },
};

module.exports = nextConfig;
