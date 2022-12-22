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
            title="Owenii"
            description="A collection of fun guessing and statistics based browser games. Play games such as YouTuber Higher or Lower."
            url="/"
        />
    </>;
};
