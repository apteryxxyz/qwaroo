import { URL } from 'node:url';
import { handle, useMethods } from '@qwaroo/middleware';
import { Authentication, getEnv } from '@qwaroo/server';
import { APIRoutes, WebRoutes } from '@qwaroo/types';
import * as passport from 'passport';
import { DiscordPassport } from '#/passports/DiscordPassport';

const WebUrl = getEnv(String, 'WEB_URL');

export default () => {
    const router = require('express').Router();

    for (const Passport of [DiscordPassport]) {
        const provider = new Passport().providerName;

        router.all(
            APIRoutes.authLogin(provider),
            useMethods(['GET']),
            passport.authenticate(provider, {
                session: false,
                state: 'qwaroo',
                duration: 'permanent',
            } as unknown as Record<string, unknown>)
        );

        router.all(
            APIRoutes.authCallback(provider),
            useMethods(['GET']),
            passport.authenticate(provider, {
                failureRedirect: APIRoutes.authFailure(provider),
                session: false,
            } as unknown as Record<string, unknown>),
            handle(async (req, res) => {
                if (!req.user)
                    return res.redirect(APIRoutes.authLogin(provider));

                const { id, revokeToken } = req.user;
                const token = Authentication.createToken(id, revokeToken);

                const destination = new URL(WebRoutes.loginCallback(), WebUrl);
                destination.searchParams.set('id', req.user.id);
                destination.searchParams.set('provider', provider);
                destination.searchParams.set('token', token);

                return res.redirect(destination.toString());
            })
        );

        router.all(
            APIRoutes.authFailure(provider),
            useMethods(['GET']),
            handle(async (_req, res) => {
                const destination = new URL(WebRoutes.loginFailure(), WebUrl);
                destination.searchParams.set('provider', provider);

                return res.redirect(destination.toString());
            })
        );
    }

    passport.initialize();
    return router;
};
