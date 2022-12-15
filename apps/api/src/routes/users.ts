import { ServerError as Error } from '@owenii/common';
import { Routes } from '@owenii/types';
import { Router } from 'express';
import { Users } from '#/handlers/Users';
import { useMe, useMustBeMe } from '#/middleware/useMe';
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
            const term = String(req.query['term'] ?? '');
            const limit = Number(req.query['limit'] ?? 10);
            const skip = Number(req.query['skip'] ?? 0);

            const [data, items] = await Users.getUsers(term, limit, skip);
            res.status(200).json({ success: true, ...data, items });
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
            if (!connection) throw new Error(404, 'Connection was not found');
            res.status(200).json({ success: true, ...connection.toJSON() });
        })
    );

    return router;
};
