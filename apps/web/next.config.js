const { WebRoutes } = require('@qwaroo/types');

/** @type {import('next').NextConfig} */
let nextConfig = {
    distDir: process.env['BUILD_DIR'] ?? '.next',
    reactStrictMode: false,
    poweredByHeader: false,
    swcMinify: true,
    async redirects() {
        return [
            {
                source: WebRoutes.discordSupport(),
                destination: 'https://discord.gg/vZQbMhwsKY',
                permanent: false,
            },
            {
                source: WebRoutes.discordInvite(),
                destination: 'https://discord.com/api/oauth2/authorize?client_id=1048791046571700274&scope=applications.commands+bot',
                permanent: false,
            },
            {
                source: WebRoutes.donate(),
                destination: 'https://buymeacoffee.com/apteryx',
                permanent: false,
            }
        ]
    }
};

if (process.env['ANALYSE'] === 'true') {
    nextConfig = require('@next/bundle-analyzer')()(nextConfig);
}

module.exports = nextConfig;
