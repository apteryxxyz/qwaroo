import process from 'node:process';
import { URL } from 'node:url';
import { Routes } from '@owenii/routes/api';
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

    router.all(Routes.discordLogin(), useMethods(['GET']), discord.login());

    router.all(
        Routes.discordCallback(),
        useMethods(['GET']),
        discord.callback(),
        handle(async (req, res) => {
            if (!req.user) {
                res.redirect('/auth/discord/login');
                return;
            }

            const { id, revokeToken } = req.user;
            const token = Authentication.createToken(id, revokeToken);

            const redirectUrl = new URL(
                '/auth/callback',
                process.env['WEB_URL']
            );
            redirectUrl.searchParams.set('uid', id);
            redirectUrl.searchParams.set('token', token);

            res.redirect(redirectUrl.toString());
        })
    );

    return router;
};
