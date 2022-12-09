import type { NextFunction, Request, Response } from 'express';
import { APIError } from '#/utilities/APIError';

/** A simple function to catch route errors. */
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
            const apiError =
                error instanceof APIError ? error : new APIError(500);

            if (apiError.status === 500) console.error(error);

            if (apiError.headers)
                for (const [key, value] of Object.entries(apiError.headers))
                    res.setHeader(key, value);

            res.status(apiError.status).json({
                success: false,
                ...apiError.toJSON(),
            });
        }
    };
}
