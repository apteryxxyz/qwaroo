import { ServerError as Error } from '@qwaroo/common';
import {
    handle,
    useMe,
    useMethods,
    useMustBeMe,
    useToken,
} from '@qwaroo/middleware';
import { Users } from '@qwaroo/server';
import { APIRoutes } from '@qwaroo/types';

export default () => {
    const router = require('express').Router();

    router.all(
        APIRoutes.users(),
        useMethods(['GET']),
        useToken([]),
        handle(async (req, res) => {
            const opts: Record<string, unknown> = {};

            opts['ids'] = Array.isArray(req.search['ids'])
                ? req.search['ids']
                : undefined;

            opts['term'] = String(req.search['term'] ?? '') || undefined;
            opts['limit'] = Number(req.search['limit'] ?? 0) || undefined;
            opts['skip'] = Number(req.search['skip'] ?? 0) || undefined;

            opts['sort'] = String(req.search['sort'] ?? '') || undefined;
            opts['order'] = String(req.search['order'] ?? '') || undefined;

            const [data, items] = await Users.getUsers(opts);
            res.status(200).json({ success: true, ...data, items });
        })
    );

    router.all(
        APIRoutes.user(':userId'),
        useMethods(['GET']),
        useToken([]),
        useMe('userId'),
        handle(async (req, res) => {
            const userId = String(req.params['userId'] || '');
            const user = await Users.getUser(userId);

            res.status(200).json({ success: true, ...user.toJSON() });
        })
    );

    router.all(
        APIRoutes.userConnections(':userId'),
        useMethods(['GET']),
        useToken([]),
        useMe('userId'),
        useMustBeMe('userId', ['GET']),
        handle(async (req, res) => {
            const userId = String(req.params['userId'] || '');
            const user = await Users.getUser(userId);

            const connections = await user.getConnections();

            res.status(200).json({ success: true, items: connections });
        })
    );

    router.all(
        APIRoutes.userConnection(':userId', ':connectionId'),
        useMethods(['GET']),
        useToken([]),
        useMe('userId'),
        useMustBeMe('userId', ['GET']),
        handle(async (req, res) => {
            const userId = String(req.params['userId'] || '');
            const user = await Users.getUser(userId);

            const connectionId = String(req.params['connectionId'] || '');
            const connection = await user.getConnection(connectionId);
            if (!connection) throw new Error(404, 'Connection not found');

            res.status(200).json({ success: true, ...connection.toJSON() });
        })
    );

    return router;
};
