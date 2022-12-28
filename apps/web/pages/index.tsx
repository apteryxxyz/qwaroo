import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PageSeo } from '#/components/Seo/Page';

export default () => {
    const router = useRouter();

    useEffect(() => {
        // No home page yet, so redirect to games
        void router.push('/games');
    }, []);

    return <>
        <PageSeo
            title="Qwaroo"
            description="A collection of fun guessing and statistics based browser games.
            Can you guess which country has a higher population, or which movie has a better rating on IMDb?
            Find one today!"
            url="/"
        />
    </>;
};
