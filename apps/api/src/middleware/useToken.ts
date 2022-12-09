import type { UserDocument } from '@owenii/database';
import { Authentication } from '#/handlers/Authentication';
import { APIError } from '#/utilities/APIError';
import { handle } from '#/utilities/routeHandler';

export function useToken(
    requiredMethods: string[],
    optionalMethods: string[] = []
) {
    return handle(async (req, _res, next) => {
        const isRequired = requiredMethods.includes(req.method);
        const isOptional = optionalMethods.includes(req.method);
        if (!isRequired && !isOptional) return next();

        const authToken = req.header('Authorization')?.replace('Bearer ', '');

        if (!authToken) {
            if (isOptional) return next();
            throw new APIError(401, 'You must be logged in to do that');
        }

        await Authentication.loginWithToken(authToken) //
            .then((user: UserDocument) => {
                req.user = user;
                next();
            });
    });
}

declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}
