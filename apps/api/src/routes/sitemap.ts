import process from 'node:process';
import { Game, User } from '@owenii/database';
import { Router } from 'express';
import { useMethods } from '#/middleware/useMethods';
import { useStaticToken } from '#/middleware/useToken';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();

    router.all(
        '/sitemap/games',
        useMethods(['GET']),
        useStaticToken(process.env['SITEMAP_TOKEN'] ?? ''),
        handle(async (_req, res) => {
            const games = await Game.find().exec();
            const gameIds = games.map(game => game.id);
            res.status(200).json({ success: true, items: gameIds });
        })
    );

    router.all(
        '/sitemap/users',
        useMethods(['GET']),
        useStaticToken(process.env['SITEMAP_TOKEN'] ?? ''),
        handle(async (_req, res) => {
            const users = await User.find().exec();
            const userIds = users.map(user => user.id);
            res.status(200).json({ success: true, items: userIds });
        })
    );

    return router;
};
