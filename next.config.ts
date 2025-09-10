/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // غیرفعال کردن بررسی‌های ESLint در زمان Build
  },
  webpack: (config: { externals: any[]; }) => {
    config.externals = [...config.externals, '.prisma/client']; // حل مشکل مربوط به Prisma در Build
    return config;
  },
};

module.exports = nextConfig;
