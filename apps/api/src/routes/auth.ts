import { URL } from 'node:url';
import { Router } from 'express';
import passport from 'passport';
import { Authentication } from '#/handlers/Authentication';
import { useMethods } from '#/middleware/useMethods';
import { DiscordPassport } from '#/passports/DiscordPassport';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();
    const discord = new DiscordPassport();
    passport.initialize();

    router.all('/auth/discord/login', useMethods(['GET']), discord.login());

    router.all(
        '/auth/discord/callback',
        useMethods(['GET']),
        discord.callback(),
        handle(async (req, res) => {
            if (!req.user) return res.redirect('/auth/discord/login');
            const { id, revokeToken } = req.user;
            const token = Authentication.createToken(id, revokeToken);

            const redirectUrl = new URL(
                '/auth/callback',
                'https://example.com'
            );
            redirectUrl.searchParams.set('uid', id);
            redirectUrl.searchParams.set('token', token);

            res.redirect(redirectUrl.toString());
        })
    );

    return router;
};
