const { withContentlayer } = require('next-contentlayer2');

let envImageUnoptimize = process.env.NODE_ENV !== "production" ? false : true

/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   serverActions: true,
  // },
  // output: 'export',
  images: {
    unoptimized: envImageUnoptimize,
  },
};

module.exports = withContentlayer(nextConfig);
