import { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint checks during build
  },
  webpack: (config: Configuration) => {
    // Add prisma client to externals to resolve an issue during build
    if (config.externals) {
      config.externals.push('.prisma/client');
    } else {
      config.externals = ['.prisma/client'];
    }
    return config;
  },
};

module.exports = nextConfig;
