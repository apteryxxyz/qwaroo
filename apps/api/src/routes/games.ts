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
            const term = String(req.query['term'] ?? '');
            const limit = Number(req.query['limit'] ?? 10);
            const skip = Number(req.query['skip'] ?? 0);

            const [data, items] = await Games.getGames(term, limit, skip);
            res.status(200).json({ success: true, ...data, items });
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

    router.all(
        Routes.gameItems(':gameId'),
        useMethods(['GET']),
        useToken([], ['GET']),
        handle(async (req, res) => {
            const gameId = String(req.params['gameId'] ?? '');
            const game = Validate.Slug.test(gameId)
                ? await Games.getGameBySlug(gameId)
                : await Games.getGameById(gameId);

            let seed = String(req.query['seed'] ?? '');
            const limit = Number(req.query['limit'] ?? 5);
            const skip = Number(req.query['skip'] ?? 0);

            // Prevent a custom seed from being used
            if (skip === 0) seed = Date.now().toString();

            const args = [game, seed, limit, skip] as const;
            const [data, items] = await Games.getGameItems(...args);
            res.status(200).json({ success: true, ...data, items });
        })
    );

    return router;
};
