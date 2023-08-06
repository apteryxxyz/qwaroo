require('@qwaroo/env');

const { withContentlayer } = require('next-contentlayer');
const withBundleAnalyzer = require('@next/bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com', 'wsrv.nl', 'i.imgur.com'],
  },
  rewrites: () => [
    {
      source: '/discord',
      destination: 'https://discord.com/invite/vZQbMhwsKY',
    },
  ],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = withContentlayer(
  withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  })(nextConfig),
);
