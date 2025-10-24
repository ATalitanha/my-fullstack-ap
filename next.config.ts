const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint checks during build
  },
  webpack: (config) => {
    // Add prisma client to externals to resolve an issue during build
    const externals = Array.isArray(config.externals)
      ? config.externals
      : (config.externals ? [config.externals] : []);

    externals.push('.prisma/client');
    config.externals = externals;

    return config;
  },
};

module.exports = withNextIntl(nextConfig);
