import { ServerError as Error } from '@owenii/common';
import { RateLimiterMemory, type RateLimiterRes } from 'rate-limiter-flexible';
import { handle } from '#/utilities/routeHandler';

const rateLimiter = new RateLimiterMemory({ points: 60, duration: 60 });

/** Apply rate limits to an endpoint. */
export function useRateLimiter() {
    // TODO: There will be requests from our server, so in the future we'll need a way to ignore those
    // Probably just use the 'SITEMAP_TOKEN' environment variable

    return handle((req, res, next) => {
        const ip =
            req.header('X-Real-IP') ?? req.header('X-Forwarded-For') ?? req.ip;

        const addHeaders = (rlr: RateLimiterRes, isError: boolean) => {
            res.header('X-RateLimit-Limit', String(rateLimiter.points));
            res.header('X-RateLimit-Remaining', String(rlr.remainingPoints));
            res.header('X-RateLimit-Used', String(rlr.consumedPoints));
            const resetAt = (Date.now() + rlr.msBeforeNext) / 1_000;
            res.header('X-RateLimit-Reset', String(resetAt));

            if (isError) {
                const retryAfter = Math.ceil(rlr.msBeforeNext / 1_000);
                res.header('Retry-After', String(retryAfter));
            }
        };

        rateLimiter
            .consume(ip)
            .then(rlr => {
                addHeaders(rlr, false);
                next();
            })
            .catch(error => {
                addHeaders(error as RateLimiterRes, true);
                res.status(429).json({
                    success: false,
                    ...new Error(429).toJSON(),
                });
            });
    });
}
