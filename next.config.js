const { withContentlayer } = require('next-contentlayer2');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   serverActions: true,
  // },
  output: 'export',
  images: {
    unoptimized: true,
  }
};

module.exports = withContentlayer(nextConfig);
