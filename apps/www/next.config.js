require('next-ws/server').verifyPatch();

/** @type {import('next').NextConfig} */
module.exports = {
    images: {
        remotePatterns: [{ protocol: "https", hostname: "**" }],
    },
    experimental: {
        serverActions: true,
    },
};
