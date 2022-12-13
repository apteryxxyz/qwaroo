import type { UserDocument } from '@owenii/database';
import { ServerError as Error } from '@owenii/errors';
import { Authentication } from '#/handlers/Authentication';
import { handle } from '#/utilities/routeHandler';

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

declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}
