import { ServerError as Error } from '@owenii/common';
import { handle } from '#/utilities/routeHandler';

/** Replace the value of a parameter with the user's ID if it is @me. */
export function useMe(property: string) {
    return handle(async (req, _res, next) => {
        const id = String(req.params[property] ?? '');
        if (id === '@me') {
            if (!req.user)
                throw new Error(401, 'You must be logged in to do that');
            req.params[property] = req.user.id;
        }

        next();
    });
}

/** Require that a user ID property must be the same as the logged in user. */
export function useMustBeMe(property: string) {
    return handle(async (req, _res, next) => {
        const id = String(req.params[property] ?? '');
        if (id === '@me') {
            if (!req.user)
                throw new Error(401, 'You must be logged in to do that');
            req.params[property] = req.user.id;
        } else if (req.user?.id !== id) {
            throw new Error(403, 'You do not have permission to do that');
        }

        next();
    });
}
