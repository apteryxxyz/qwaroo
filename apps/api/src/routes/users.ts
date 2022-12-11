import { Routes } from '@owenii/routes/api';
import { Router } from 'express';
import { Users } from '#/handlers/Users';
import { useMe, useMustBeMe } from '#/middleware/useMe';
import { useMethods } from '#/middleware/useMethods';
import { useToken } from '#/middleware/useToken';
import { APIError } from '#/utilities/APIError';
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
        useMethods(['GET']),
        useToken([], ['GET']),
        useMe('userId'),
        handle(async (req, res) => {
            const user = await Users.getUser(req.params['userId']);
            res.status(200).json({ success: true, ...user.toJSON() });
        })
    );

    router.all(
        Routes.userConnections(':userId'),
        useMethods(['GET']),
        useToken([], ['GET']),
        useMe('userId'),
        useMustBeMe('userId'),
        handle(async (req, res) => {
            const user = await Users.getUser(req.params['userId']);
            const connections = await user.getConnections();
            res.status(200).json({ success: true, items: connections });
        })
    );

    router.all(
        Routes.userConnection(':userId', ':connectionId'),
        useMethods(['GET']),
        useToken([], ['GET']),
        useMe('userId'),
        useMustBeMe('userId'),
        handle(async (req, res) => {
            const user = await Users.getUser(req.params['userId']);
            const connectionId = String(req.params['connectionId'] ?? '');
            const connection = await user.getConnection(connectionId);
            if (!connection)
                throw new APIError(404, 'Connection was not found');
            res.status(200).json({ success: true, ...connection });
        })
    );

    return router;
};
