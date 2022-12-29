import process from 'node:process';
import { URL } from 'node:url';
import { Routes } from '@qwaroo/types';
import { Router } from 'express';
import passport from 'passport';
import { Authentication } from '#/handlers/Authentication';
import { useMethods } from '#/middleware/useMethods';
import { DiscordPassport } from '#/passports/Discord';
import { GitHubPassport } from '#/passports/GitHub';
import { RedditPassport } from '#/passports/Reddit';
import { handle } from '#/utilities/routeHandler';

export default () => {
    const router = Router();
    new DiscordPassport();
    new GitHubPassport();
    new RedditPassport();
    passport.initialize();

    const providers = ['discord', 'github', 'reddit'] as const;

    for (const provider of providers) {
        router.all(
            Routes.authLogin(provider),
            useMethods(['GET']),
            // @ts-expect-error 2769
            passport.authenticate(provider, {
                session: false,
                state: 'qwaroo',
                duration: 'permanent',
            })
        );

        router.all(
            Routes.authCallback(provider),
            useMethods(['GET']),
            passport.authenticate(provider, {
                failureRedirect: `/auth/${provider}/failure`,
                session: false,
            }),
            handle(async (req, res) => {
                if (!req.user) {
                    res.redirect(`/auth/${provider}/login`);
                    return;
                }

                const { id, revokeToken } = req.user;
                const token = Authentication.createToken(id, revokeToken);

                const webUrl = process.env['WEB_URL']!;
                const redirectUrl = new URL('/auth/callback', webUrl);
                redirectUrl.searchParams.set('uid', id);
                redirectUrl.searchParams.set('token', token);
                redirectUrl.searchParams.set('provider', provider);

                res.redirect(redirectUrl.toString());
            })
        );

        router.all(
            Routes.authFailure(provider),
            useMethods(['GET']),
            (_req, res) => {
                const webUrl = process.env['WEB_URL']!;
                const redirectUrl = new URL('/auth/failure', webUrl);
                redirectUrl.searchParams.set('provider', provider);
                res.redirect(redirectUrl.toString());
            }
        );
    }

    return router;
};
