import { ServerError as Error } from '@qwaroo/common';
import { Authentication, type User as OurUser } from '@qwaroo/server';
import { handle } from '#/utilities/handle';

/**
 * Parse and verify the auth token for an endpoint.
 * If the token is valid, the user will be attached to the request.
 */
export function useToken(methods: string[]) {
    return handle(async (req, _res, next) => {
        if (req.user || req.method === 'OPTIONS') return next();

        const isRequired = methods.includes(req.method);
        const authToken = req.header('authorisation');
        if (!isRequired && !authToken) return next();

        if (!authToken)
            throw new Error(401, 'You must be logged in to do that');

        await Authentication.loginWithToken(authToken).then(user => {
            req.user = user;
            next();
        });
    });
}

export function useStaticToken(token: string) {
    return handle(async (req, _res, next) => {
        if (req.user || req.method === 'OPTIONS') return next();

        const authToken = req.header('authorisation');
        if (!authToken || authToken !== token)
            throw new Error(401, 'Authorisation token is not valid');

        next();
    });
}

declare global {
    namespace Express {
        interface User extends OurUser.Document {}

        interface Request {
            user: User;
        }
    }
}
