import { ServerError as Error } from '@qwaroo/common';
import type { UserDocument } from '@qwaroo/database';
import { Authentication } from '#/handlers/Authentication';
import { handle } from '#/utilities/routeHandler';

/**
 * Parse and verify the auth token for an endpoint.
 * If the token is valid, the user will be attached to the request.
 */
export function useToken(
    requiredMethods: string[],
    optionalMethods: string[] = []
) {
    return handle(async (req, _res, next) => {
        if (req.user) {
            next();
            return;
        }

        const isRequired = requiredMethods.includes(req.method);
        const isOptional = optionalMethods.includes(req.method);
        if (!isRequired && !isOptional) {
            next();
            return;
        }

        const authToken = req.header('Authorization');
        if (!authToken) {
            if (isOptional) {
                next();
                return;
            }

            throw new Error(401, 'You must be logged in to do that');
        }

        await Authentication.loginWithToken(authToken) //
            .then((user: UserDocument) => {
                user.seenTimestamp = Date.now();
                void user.save();

                req.user = user;
                next();
            });
    });
}

/** Require that the auth token be the same as the parameter. */
export function useStaticToken(token: string) {
    return handle(async (req, _res, next) => {
        const authToken = req.header('Authorization');
        if (authToken !== token)
            throw new Error(401, 'Authorisation token is invalid');

        next();
    });
}

declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}
