import { Validate } from '@owenii/common';
import { Routes } from '@owenii/types';
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
            const opts: Record<string, unknown> = {};
            opts['term'] = String(req.query['term'] ?? '') || undefined;
            opts['limit'] = Number(req.query['limit'] ?? 0) || undefined;
            opts['skip'] = Number(req.query['skip'] ?? 0) || undefined;
            opts['sort'] = String(req.query['sort'] ?? '') || undefined;
            opts['order'] = String(req.query['order'] ?? '') || undefined;

            const slugs = String(req.query['slugs'] ?? '');
            if (slugs) opts['slugs'] = slugs.split(',');
            const categories = String(req.query['categories'] ?? '');
            if (categories) opts['categories'] = categories.split(',');
            const modes = String(req.query['modes'] ?? '');
            if (modes) opts['modes'] = modes.split(',');

            const [data, items] = await Games.getGames(opts);
            res.status(200).json({ success: true, ...data, items });
        })
    );

    router.all(
        Routes.game(':gameId'),
        useMethods(['GET']),
        useToken([], ['GET']),
        handle(async (req, res) => {
            const gameId = String(req.params['gameId'] ?? '');
            const game = Validate.ObjectId.test(gameId)
                ? await Games.getGameById(gameId)
                : await Games.getGameBySlug(gameId);
            res.status(200).json({ success: true, ...game.toJSON() });
        })
    );

    router.all(
        Routes.gameItems(':gameId'),
        useMethods(['GET']),
        useToken([], ['GET']),
        handle(async (req, res) => {
            const gameId = String(req.params['gameId'] ?? '');
            const game = Validate.ObjectId.test(gameId)
                ? await Games.getGameById(gameId)
                : await Games.getGameBySlug(gameId);

            let seed = String(req.query['seed'] ?? '') || undefined;
            const limit = Number(req.query['limit'] ?? 0) || undefined;
            const skip = Number(req.query['skip'] ?? 0) || undefined;

            // Prevent a custom seed from being used
            if (!seed || skip === 0) seed = Math.random().toString(36).slice(2);

            const args = [game, seed, limit, skip] as const;
            const [data, items] = await Games.getGameItems(...args);
            res.status(200).json({ success: true, ...data, items });
        })
    );

    return router;
};
