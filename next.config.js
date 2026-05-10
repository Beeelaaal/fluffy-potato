/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'next-build',
  experimental: {},
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com', 'picsum.photos'],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig;
