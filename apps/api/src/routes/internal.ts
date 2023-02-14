import { URL } from 'node:url';
import { handle, useMethods, useStaticToken } from '@qwaroo/middleware';
import { Game, User, getEnv } from '@qwaroo/server';
import { APIRoutes } from '@qwaroo/types';

export default () => {
    const router = require('express').Router();

    router.all(
        APIRoutes.internalSitemap(),
        useMethods(['GET']),
        useStaticToken(getEnv(String, 'INTERNAL_TOKEN')),
        handle(async (_req, res) => {
            const baseWebUrl = new URL(getEnv(String, 'WEB_URL'));

            const games = await Game.Model.find().exec();
            const gameFields = games.map(game => ({
                loc: new URL(`/games/${game.slug}`, baseWebUrl).toString(),
                lastmod: new Date(game.updatedTimestamp).toISOString(),
                changefreq: 'weekly',
                priority: 0.8,
            }));

            const users = await User.Model.find().exec();
            const userFields = users.map(user => ({
                loc: new URL(`/users/${user.id}`, baseWebUrl).toString(),
                lastmod: new Date(user.lastSeenTimestamp).toISOString(),
                changefreq: 'weekly',
                priority: 0.8,
            }));

            const fields = [...gameFields, ...userFields];
            res.status(200).json({ success: true, items: fields });
        })
    );

    return router;
};
