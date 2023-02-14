import { ServerError as Error } from '@qwaroo/common';
import type { NextFunction, Request, Response } from 'express';

export function handle(
    fn: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void> | void
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            // If the error is not an instance of our error,
            // return an internal server error
            const err = error instanceof Error ? error : new Error(500);
            if (err.status === 500) console.error(error);
            if (err.headers) res.set(err.headers);
            req.app.locals['onError'](err, req, res);
        }
    };
}
