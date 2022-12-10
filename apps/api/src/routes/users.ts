import { Routes } from '@owenii/routes/api';
import { Router } from 'express';
import { Users } from '#/handlers/Users';
import { useAtMe } from '#/middleware/useAtMe';
import { useBody } from '#/middleware/useBody';
import { useMethods } from '#/middleware/useMethods';
import { useToken } from '#/middleware/useToken';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();

    router.all(
        Routes.users(),
        useMethods(['GET']),
        useToken([], ['GET']),
        handle(async (req, res) => {
            const term = String(req.query['term'] ?? '') || '';
            const page = Number(req.query['page'] ?? 1);

            const data = await Users.getPaginatedUsers(term, page);
            res.status(200).json({ success: true, ...data });
        })
    );

    router.all(
        Routes.user(':userId'),
        useMethods(['GET', 'PATCH', 'DELETE']),
        useBody('json', ['PATCH']),
        useToken(['PATCH', 'DELETE'], ['GET']),
        useAtMe('userId'),
        handle(async (req, res) => {
            if (req.method === 'GET') {
                const user = await Users.getUser(req.params['userId']);
                res.status(200).json({ success: true, ...user.toJSON() });
            }

            // TODO: Add PATCH and DELETE
        })
    );

    router.all(
        Routes.userConnections(':userId'),
        useMethods(['GET']),
        useAtMe('userId'),
        handle(async (req, res) => {
            const user = await Users.getUser(req.params['userId']);
            const connections = await user.getConnections();
            res.status(200).json({ success: true, items: connections });
        })
    );

    return router;
};
