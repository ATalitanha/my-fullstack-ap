import type { Configuration } from "webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
	compress: true,
	webpack: (config: Configuration) => {
		// Add prisma client to externals to resolve an issue during build
		const externals = Array.isArray(config.externals)
			? config.externals
			: config.externals
				? [config.externals]
				: [];

		externals.push(".prisma/client");
		config.externals = externals;

		return config;
	},
	turbopack: {},
};

module.exports = nextConfig;
