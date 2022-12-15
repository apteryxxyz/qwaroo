import process from 'node:process';
import { URLSearchParams } from 'node:url';
import { ServerError as Error } from '@owenii/common';
import { handle } from '#/utilities/routeHandler';

export function useCaptcha(methods: string[]) {
    return handle(async (req, _, next) => {
        if (!methods.includes(req.method)) {
            next();
            return;
        }

        const token = req.header('X-Captcha-Token');
        const remoteIp = req.header('X-Real-IP') ?? req.ip;

        if (!token) throw new Error(401, 'No captcha token was provided');
        if (token === process.env['CAPTCHA_ALWAYS_PASS']) {
            next();
            return;
        }

        const data = new URLSearchParams({
            secret: process.env['CAPTCHA_SECRET']!,
            response: token,
            remoteip: remoteIp!,
        });

        const url = process.env['CAPTCHA_SITE_VERIFY_URL']!;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data,
        });

        const json = await response.json();
        if (json.success) {
            next();
            return;
        }

        throw new Error(400, 'Captcha verification failed');
    });
}
