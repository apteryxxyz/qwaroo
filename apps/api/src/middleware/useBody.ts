import parse from 'co-body';
import { APIError } from '#/utilities/APIError';
import { handle } from '#/utilities/routeHandler';

const ContentType = {
    json: 'application/json',
    form: 'application/x-www-form-urlencoded',
};

const TypeParsers = {
    json: parse.json,
    form: parse.form,
};

export function useBody(type: 'json' | 'form', methods: string[]) {
    return handle(async (req, _, next) => {
        if (!methods.includes(req.method)) return next();

        const contentType = req.header('content-type');
        const isJson = contentType?.includes(ContentType[type]);
        const isForm = contentType?.includes(ContentType[type]);

        if (!isJson && !isForm) {
            throw new APIError(415);
        } else {
            const parser = TypeParsers[type];
            await parser(req, { limit: '1mb' })
                .then(body => {
                    req.body = body;
                    next();
                })
                .catch(() => {
                    throw new APIError(400, 'Could not parse body');
                });
        }
    });
}
