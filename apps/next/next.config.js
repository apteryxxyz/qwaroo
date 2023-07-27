require('@qwaroo/env');

const { withContentlayer } = require('next-contentlayer');
const withBundleAnalyzer = require('@next/bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
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
