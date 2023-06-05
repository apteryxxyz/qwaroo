import { ms } from 'enhanced-ms';
import type z from 'zod';
import { fromZodError } from 'zod-validation-error';

export function serverAction<S extends z.ZodTypeAny>(options: {
    bodySchema?: S;
    cacheTime?: string;
}) {
    const cache = new Map();
    const cacheTime = ms(options.cacheTime ?? '0s') ?? -1;

    return function _<R>(action: (body: z.infer<S>) => Promise<R>) {
        return async (body: z.infer<S>) => {
            const key = JSON.stringify(body);

            if (options.cacheTime) {
                if (cacheTime === -1) cache.delete(key);
                else if (cache.has(key)) {
                    console.info('cache hit', key);
                    return cache.get(key) as R;
                } else console.info('cache miss', key);
            }

            if (options.bodySchema) {
                const result = options.bodySchema.safeParse(body);
                if (!result.success) throw fromZodError(result.error);
            }

            const result = await action(body);

            if (cacheTime) {
                cache.set(key, result);
                if (cacheTime !== -1) setTimeout(() => cache.delete(key), cacheTime);
            }

            return result;
        };
    };
}
