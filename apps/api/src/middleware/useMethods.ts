import { APIError } from '#/utilities/APIError';
import { handle } from '#/utilities/routeHandler';

export function useMethods(methods: string[]) {
    return handle(async (req, _, next) => {
        if (methods.includes(req.method)) return next();
        else throw new APIError(405);
    });
}
