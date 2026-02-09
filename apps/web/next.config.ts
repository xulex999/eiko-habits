import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@eiko/shared-types', '@eiko/shared-logic'],
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'recharts'],
  },
};

export default nextConfig;
