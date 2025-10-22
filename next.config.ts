import { Configuration } from "webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: Configuration) => {
    const externals = config.externals || [];
    if (Array.isArray(externals)) {
      config.externals = [...externals, ".prisma/client"];
    } else {
      config.externals = [externals, ".prisma/client"];
    }
    return config;
  },
};

module.exports = nextConfig;
