import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default withNextIntl(nextConfig);
