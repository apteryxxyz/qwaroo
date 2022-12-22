import { ServerError as Error } from '@owenii/common';
import { handle } from '#/utilities/routeHandler';

/** Limit an endpoint to a set of methods. */
export function useMethods(methods: string[]) {
    return handle(async (req, _, next) => {
        if (methods.includes(req.method)) {
            next();
            return;
        }

        throw new Error(405);
    });
}
