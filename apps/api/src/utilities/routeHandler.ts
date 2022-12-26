import { ServerError as Error } from '@qwaroo/common';
import type { NextFunction, Request, Response } from 'express';

/**
 * A function to wrap around endpoint functions.
 * This will catch and handle any errors.
 */
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
            // If the error is not an instance of out APIError,
            // return an internal server error
            const apiError = error instanceof Error ? error : new Error(500);

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
