import { Validate } from '@qwaroo/common';
import { WebRoutes } from '@qwaroo/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Loading } from '#/components/Loading';
import { Seo } from '#/components/Seo';
import { documentCookie } from '#/utilities/cookies';

export default () => {
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;

        const url = new URL(router.asPath, window.location.origin);
        const id = url.searchParams.get('id') ?? '';
        const token = url.searchParams.get('token');

        if (Validate.ObjectId.test(id) && token) {
            localStorage.setItem('qwaroo.user_id', id);
            documentCookie.setItem('qwaroo.user_id', id, 365);
            localStorage.setItem('qwaroo.token', token);
            documentCookie.setItem('qwaroo.token', token, 365);

            void router //
                .push(WebRoutes.profile())
                .then(() => router.reload());
        } else void router.push(WebRoutes.loginFailure());
    }, [router.isReady]);

    return <section className="flex flex-col gap-3">
        <Seo title="Attempting Login" noIndex />

        <Loading.Circle className="my-auto" />
    </section>;
};
