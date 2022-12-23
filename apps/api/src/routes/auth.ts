import process from 'node:process';
import { URL } from 'node:url';
import { Routes } from '@owenii/types';
import { Router } from 'express';
import passport from 'passport';
import { Authentication } from '#/handlers/Authentication';
import { useMethods } from '#/middleware/useMethods';
import { DiscordPassport } from '#/passports/Discord';
import { GitHubPassport } from '#/passports/GitHub';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();
    new DiscordPassport();
    new GitHubPassport();
    passport.initialize();

    const providers = ['discord', 'github'] as const;

    for (const provider of providers) {
        router.all(
            Routes.authLogin(provider),
            useMethods(['GET']),
            passport.authenticate(provider, { session: false })
        );

        router.all(
            Routes.authCallback(provider),
            useMethods(['GET']),
            passport.authenticate(provider, {
                failureRedirect: '/login',
                session: false,
            }),
            handle(async (req, res) => {
                if (!req.user) {
                    res.redirect(`/auth/${provider}/login`);
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
                redirectUrl.searchParams.set('method', provider);

                res.redirect(redirectUrl.toString());
            })
        );
    }

    return router;
};
