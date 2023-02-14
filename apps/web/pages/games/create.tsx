import { WebRoutes } from '@qwaroo/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ComingSoon } from '#/components/Display/ComingSoon';
import { Loading } from '#/components/Loading';
import { PageSeo } from '#/components/Seo';

export default () => {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const id = localStorage.getItem('qwaroo.user_id');
        const token = localStorage.getItem('qwaroo.token');
        if (!id || !token) void router.replace(WebRoutes.login());
        else setIsReady(true);
    }, []);

    return <>
        <PageSeo
            url={WebRoutes.createGame()}
            title="Create Game"
            description="View your Qwaroo profile, containing your game statistics, achievements, created games, and more."
        />

        {isReady ? <ComingSoon /> : <Loading.Circle className="my-auto" />}
    </>;
};
