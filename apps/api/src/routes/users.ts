import { Router } from 'express';
import { Users } from '#/handlers/Users';
import { useBody } from '#/middleware/useBody';
import { useMethods } from '#/middleware/useMethods';
import { useToken } from '#/middleware/useToken';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();

    router.all(
        '/users',
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
        '/users/:id',
        useMethods(['GET', 'PATCH', 'DELETE']),
        useBody('json', ['PATCH']),
        useToken(['PATCH', 'DELETE'], []),
        handle(async (req, res) => {
            if (req.method === 'GET') {
                const user = await Users.getUser(req.params['id']);
                res.status(200).json({ success: true, ...user.toJSON() });
            }

            // TODO: Add PATCH and DELETE
        })
    );

    router.all(
        '/users/:id/connections',
        useMethods(['GET']),
        handle(async (req, res) => {
            const user = await Users.getUser(req.params['id']);
            const connections = await user.getConnections();
            res.status(200).json({ success: true, items: connections });
        })
    );

    return router;
};
