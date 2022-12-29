import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Loading } from '#/components/Display/Loading';
import { Seo } from '#/components/Seo/Seo';

export default () => {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            let backTo = localStorage.getItem('qwaroo.back_to') ?? '/games';
            if (backTo.startsWith('/auth/failure')) backTo = '/games';
            void router.push(backTo);
        }
    }, [router.isReady]);

    return <>
        <Seo title="Authorisation Failure" noIndex />
        <Loading />
    </>;
};
