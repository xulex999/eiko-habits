import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@eiko/shared-types', '@eiko/shared-logic'],
};

export default nextConfig;
