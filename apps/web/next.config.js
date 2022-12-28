/** @type {import('next').NextConfig} */
let nextConfig = {
    distDir: process.env['BUILD_DIR'] ?? '.next',
    reactStrictMode: false,
    poweredByHeader: false,
    swcMinify: true,
    async redirects() {
        return [
            {
                source: '/discord',
                destination: 'https://discord.gg/vZQbMhwsKY',
                permanent: false,
            }
        ]
    }
};

if (process.env['ANALYSE'] === 'true') {
    nextConfig = require('@next/bundle-analyzer')()(nextConfig);
}

module.exports = nextConfig;
