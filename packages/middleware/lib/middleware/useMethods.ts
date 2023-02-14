import { ServerError as Error, Query } from '@qwaroo/common';
import { handle } from '#/utilities/handle';

/** Limit an endpoint to a set of methods. */
export function useMethods(methods: string[]) {
    return handle(async (req, res, next) => {
        const queryString = req.url.split('?')[1] ?? '';
        req.search = Query.parse(queryString);

        res.set('Access-Control-Allow-Methods', methods.join(', '));

        if (req.method === 'OPTIONS') res.status(204).end();
        else if (methods.includes(req.method)) return next();
        else throw new Error(405);
    });
}

declare global {
    namespace Express {
        interface Request {
            search: Query.Object;
        }
    }
}
