import { ServerError as Error } from '@owenii/errors';
import { handle } from '#/utilities/routeHandler';

export function useMethods(methods: string[]) {
    return handle(async (req, _, next) => {
        if (methods.includes(req.method)) {
            next();
            return;
        }

        throw new Error(405);
    });
}
