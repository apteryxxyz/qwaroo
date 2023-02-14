import { WebRoutes } from '@qwaroo/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Loading } from '#/components/Loading';
import { PageSeo } from '#/components/Seo';

export default () => {
    const router = useRouter();

    useEffect(() => {
        const id = localStorage.getItem('qwaroo.user_id');
        const token = localStorage.getItem('qwaroo.token');

        const path = id && token ? WebRoutes.user(id) : WebRoutes.login();
        void router.replace(path);
    }, []);

    return <>
        <PageSeo
            url={WebRoutes.profile()}
            title="My Profile"
            description="View your Qwaroo profile, containing your game statistics, achievements, created games, and more."
        />

        <Loading.Circle className="my-auto" />
    </>;
};
