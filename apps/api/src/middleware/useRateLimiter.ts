import { RateLimiterMemory, type RateLimiterRes } from 'rate-limiter-flexible';
import { APIError } from '#/utilities/APIError';
import { handle } from '#/utilities/routeHandler';

const rateLimiter = new RateLimiterMemory({ points: 6, duration: 1 });

export function useRateLimiter() {
    return handle((req, _, next) => {
        const ip =
            req.header('X-Real-IP') ?? req.header('X-Forwarded-For') ?? req.ip;

        rateLimiter
            .consume(ip)
            .then(() => next())
            .catch(error => {
                const res = error as RateLimiterRes;
                throw new APIError(429, undefined, {
                    'Retry-After': String(res.msBeforeNext / 1_000),
                });
            });
    });
}
