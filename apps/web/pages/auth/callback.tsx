import { Validate } from '@qwaroo/common';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Loading } from '#/components/Display/Loading';
import { Seo } from '#/components/Seo/Seo';
import { documentCookie } from '#/utilities/documentCookie';
import { emitEvent } from '#/utilities/googleServices';

export default () => {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            const url = new URL(router.asPath, 'http://localhost');
            const id = url.searchParams.get('uid') ?? '';
            const token = url.searchParams.get('token') ?? '';
            const method = url.searchParams.get('method') ?? '';

            if (Validate.ObjectId.test(id) && token) {
                localStorage.setItem('qwaroo.user_id', id);
                localStorage.setItem('qwaroo.token', token);
                documentCookie.setItem('qwaroo.user_id', id, 365);
                documentCookie.setItem('qwaroo.token', token, 365);

                let backTo = localStorage.getItem('qwaroo.back_to') ?? '/games';
                if (backTo.startsWith('/auth/callback')) backTo = '/games';

                emitEvent('sign_in', {
                    user_id: id,
                    method,
                    back_to: backTo,
                });

                void router //
                    .push(backTo)
                    .then(() => router.reload());
            } else {
                void router.push('/');
            }
        }
    }, [router.isReady]);

    return <>
        <Seo title="Callback" noIndex />
        <Loading />
    </>;
};
