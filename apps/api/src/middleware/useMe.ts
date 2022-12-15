import { ServerError as Error } from '@owenii/common';
import { handle } from '#/utilities/routeHandler';

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
