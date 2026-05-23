/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow image optimization for any origin during development
  images: {
    remotePatterns: [],
  },

  // Expose the font CSS variable to Tailwind via next/font
  experimental: {
    optimizePackageImports: ["@nextui-org/react"],
  },
};

module.exports = nextConfig;
