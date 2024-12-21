import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.modules.push(path.resolve('./src')); // Allow absolute imports from 'src'
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase limit to 10MB or higher as needed
    },
  },
  rewrites: async () => {
    return [
    {
        source: '/api/:path*',
        destination:
        process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/api/:path*'
            : '/api/',
    },
    ]
},
};

export default nextConfig;
