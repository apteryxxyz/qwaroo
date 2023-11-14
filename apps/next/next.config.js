const withBundleAnalyzer = require('@next/bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ hostname: 'wsrv.nl' }] },
  rewrites: () => require('./vercel.json').rewrites ?? [],
  redirects: () => require('./vercel.json').redirects ?? [],
  typescript: { ignoreBuildErrors: true },
};

module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
