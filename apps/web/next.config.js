/** @type {import('next').NextConfig} */
let nextConfig = {
    distDir: process.env['BUILD_DIR'] ?? '.next',
    reactStrictMode: false,
    poweredByHeader: false,
    swcMinify: true,
    async redirects() {
        return [
            {
                source: '/discord/support',
                destination: 'https://discord.gg/vZQbMhwsKY',
                permanent: false,
            },
            {
                source: '/discord/invite',
                destination: 'https://discord.com/api/oauth2/authorize?client_id=1048791046571700274&scope=applications.commands+bot',
                permanent: false,
            }
        ]
    }
};

if (process.env['ANALYSE'] === 'true') {
    nextConfig = require('@next/bundle-analyzer')()(nextConfig);
}

module.exports = nextConfig;
