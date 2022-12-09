import { Router } from 'express';
import { Games } from '#/handlers/Games';
import { useMethods } from '#/middleware/useMethods';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();

    router.all(
        '/categories',
        useMethods(['GET']),
        handle(async (_req, res) => {
            const categories = Games.getCategories();
            res.status(200).json({ success: true, items: categories });
        })
    );

    router.all(
        '/games',
        useMethods(['GET']),
        handle(async (req, res) => {
            const term = String(req.params['term'] ?? '') || '';
            const page = Number(req.query['page'] ?? 1);

            const data = await Games.getPaginatedGames(term, page);
            res.status(200).json({ success: true, ...data });
        })
    );

    router.all(
        '/games/:slug',
        useMethods(['GET']),
        handle(async (req, res) => {
            const slug = String(req.params['slug'] ?? '') || '';
            const meta = await Games.getGameMeta(slug);
            res.status(200).json({ success: true, ...meta });
        })
    );

    router.all(
        '/games/:slug/items',
        useMethods(['GET']),
        handle(async (req, res) => {
            const slug = String(req.params['slug'] ?? '') || '';
            const seed =
                String(req.query['seed'] ?? '') || Date.now().toString();
            const page = Number(req.query['page'] ?? 1);

            const data = await Games.getPaginatedGameItems(slug, seed, page);
            res.status(200).json({ success: true, ...data });
        })
    );

    return router;
};
