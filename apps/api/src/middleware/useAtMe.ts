import { APIError } from '#/utilities/APIError';
import { handle } from '#/utilities/routeHandler';

export function useAtMe(property: string) {
    return handle(async (req, _res, next) => {
        const id = String(req.params[property] ?? '');
        if (id === '@me') {
            if (!req.user)
                throw new APIError(401, 'You must be logged in to do that');
            req.params[property] = req.user.id;
        }

        next();
    });
}
