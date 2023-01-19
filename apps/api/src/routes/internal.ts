import process from 'node:process';
import { URL } from 'node:url';
import { Game, User } from '@qwaroo/database';
import { Router } from 'express';
import { useMethods } from '#/middleware/useMethods';
import { useStaticToken } from '#/middleware/useToken';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();

    router.all(
        '/internal/sitemap',
        useMethods(['GET']),
        useStaticToken(process.env['INTERNAL_TOKEN']!),
        handle(async (_req, res) => {
            const baseWebUrl = new URL(process.env['WEB_URL']!);

            const games = await Game.find().exec();
            const gameSitemapFields = games.map(game => ({
                loc: new URL(`/games/${game.slug}`, baseWebUrl).toString(),
                lastmod: new Date(game.updatedTimestamp).toISOString(),
                changefreq: 'weekly',
                priority: 0.8,
            }));

            const users = await User.find().exec();
            const userSitemapFields = users.map(user => ({
                loc: new URL(`/users/${user.id}`, baseWebUrl).toString(),
                lastmod: new Date(user.seenTimestamp).toISOString(),
                changefreq: 'weekly',
                priority: 0.8,
            }));

            const sitemapFields = [...gameSitemapFields, ...userSitemapFields];
            res.status(200).json({ success: true, items: sitemapFields });
        })
    );

    return router;
};
