const webUrl = process.env['WEB_URL'];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: webUrl,
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    robotsTxtOptions: {
        additionalSitemaps: [
            `${webUrl}/sitemap.xml`,
            `${webUrl}/server-sitemap.xml`,
        ],
    },
    exclude: ['/auth/callback', '/auth/failure', '/503', '/server-sitemap.xml'],
};
