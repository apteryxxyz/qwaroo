import { Routes } from '@owenii/routes/api';
import { Validate } from '@owenii/validators';
import { Router } from 'express';
import { Games } from '#/handlers/Games';
import { useMethods } from '#/middleware/useMethods';
import { useToken } from '#/middleware/useToken';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();

    router.all(
        Routes.categories(),
        useMethods(['GET']),
        useToken([], ['GET']),
        handle(async (_req, res) => {
            const categories = await Games.getCategories();
            res.status(200).json({ success: true, items: categories });
        })
    );

    router.all(
        Routes.games(),
        useMethods(['GET']),
        useToken([], ['GET']),
        handle(async (req, res) => {
            const term = String(req.query['term'] ?? '') || '';
            const page = Number(req.query['page'] ?? 1);

            const data = await Games.getPaginatedGames(term, page);
            res.status(200).json({ success: true, ...data });
        })
    );

    router.all(
        Routes.game(':gameId'),
        useMethods(['GET']),
        useToken([], ['GET']),
        handle(async (req, res) => {
            const gameId = String(req.params['gameId'] ?? '');
            const game = Validate.Slug.test(gameId)
                ? await Games.getGameBySlug(gameId)
                : await Games.getGameById(gameId);
            res.status(200).json({ success: true, ...game.toJSON() });
        })
    );

    return router;
};
