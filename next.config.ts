import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.modules.push(path.resolve('./src')); // Allow absolute imports from 'src'
    return config;
  },
};

export default nextConfig;
