import { Validate } from '@qwaroo/common';
import { Routes } from '@qwaroo/types';
import { Router } from 'express';
import { Games } from '#/handlers/Games';
import { Statistics } from '#/handlers/Statistics';
import { Users } from '#/handlers/Users';
import { useMethods } from '#/middleware/useMethods';
import { useToken } from '#/middleware/useToken';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();

    router.all(
        Routes.gameStatistics(':gameId'),
        useMethods(['GET']),
        useToken([], ['GET']),
        handle(async (req, res) => {
            const gameId = String(req.params['gameId'] ?? '');
            const userId = String(req.user?.id ?? '');

            const user = Validate.ObjectId.test(userId)
                ? await Users.getUser(userId)
                : undefined;
            const game = Validate.ObjectId.test(gameId)
                ? await Games.getGameById(user, gameId)
                : undefined;

            const statistics = await Statistics.getGameTotals(game);
            res.status(200).json({ success: true, ...statistics });
        })
    );

    return router;
};
