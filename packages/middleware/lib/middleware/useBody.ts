import { ServerError as Error } from '@qwaroo/common';
import parse from 'co-body';
import { handle } from '#/utilities/handle';

/** Parse the body of a request and declare it on the 'body' property of the request. */
export function useBody(methods: string[]) {
    return handle(async (req, _res, next) => {
        if (!methods.includes(req.method)) return next();

        const contentType = req.header('content-type') ?? '';
        if (
            !contentType.includes('application/json') &&
            !contentType.includes('application/x-www-form-urlencoded')
        )
            throw new Error(415);

        await (contentType.includes('json') ? parse.json : parse.form)(req, {
            limit: '1mb',
        })
            .then(body => {
                req.body = body;
                next();
            })
            .catch(() => {
                throw new Error(400, 'Could not parse body');
            });
    });
}
