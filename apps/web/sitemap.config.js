const webUrl = process.env['WEB_URL'];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: webUrl,
};
