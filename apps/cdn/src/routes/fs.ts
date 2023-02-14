import { handle, useMethods, useStaticToken } from '@qwaroo/middleware';
import { getEnv } from '@qwaroo/server';
import { CDNRoutes } from '@qwaroo/types';
import { FileSystem } from '#/handlers/FileSystem';

export default () => {
    const router = require('express').Router();

    router.all(
        CDNRoutes.readDirectory(),
        useMethods(['GET']),
        // useStaticToken(getEnv(String, 'INTERNAL_TOKEN'), ['GET']),
        handle(async (req, res) => {
            const path = Object.keys(req.query)[0] ?? '';
            const data = await FileSystem.readDirectory(path);
            if (typeof data === 'number') res.status(data).end();
            else res.status(200).send(data.join('\n'));
        })
    );

    router.all(
        CDNRoutes.readFile(),
        useMethods(['GET']),
        useStaticToken(getEnv(String, 'INTERNAL_TOKEN')),
        handle(async (req, res) => {
            const path = Object.keys(req.query)[0] ?? '';
            const data = await FileSystem.readFile(path);
            if (typeof data === 'number') res.status(data).end();
            else res.status(200).send(data);
        })
    );

    router.all(
        CDNRoutes.writeFile(),
        useMethods(['POST']),
        useStaticToken(getEnv(String, 'INTERNAL_TOKEN')),
        handle(async (req, res) => {
            const path = Object.keys(req.query)[0] ?? '';
            const data = await FileSystem.writeFile(path, req.body);
            if (typeof data === 'number') res.status(data).end();
            else res.status(200).send(data);
        })
    );

    router.all(
        CDNRoutes.deleteFile(),
        useMethods(['DELETE']),
        useStaticToken(getEnv(String, 'INTERNAL_TOKEN')),
        handle(async (req, res) => {
            const path = Object.keys(req.query)[0] ?? '';
            const data = await FileSystem.deleteFile(path);
            if (typeof data === 'number') res.status(data).end();
            else res.status(200).send(data);
        })
    );

    return router;
};
