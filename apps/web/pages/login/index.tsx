import { APIRoutes, WebRoutes } from '@qwaroo/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Loading } from '#/components/Loading';
import { PageSeo } from '#/components/Seo';
import { getApiUrl } from '#/utilities/env';

export default () => {
    const router = useRouter();

    useEffect(() => {
        void router.replace(
            new URL(APIRoutes.authLogin('discord'), getApiUrl())
        );
    }, []);

    return <>
        <PageSeo
            url={WebRoutes.login()}
            title="Login"
            description="Login to Qwaroo"
        />

        <Loading.Circle className="my-auto" />
    </>;
};
