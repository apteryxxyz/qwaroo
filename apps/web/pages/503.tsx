import type { GetStaticProps } from 'next';
import { useEffect } from 'react';
import { Display } from '#/components/Display';
import { Seo } from '#/components/Seo/Seo';
import { goFullscreen } from '#/utilities/screenControl';

// This page needs to be exported using the "SingleFile" browser extension
// Then copied into the /public folder

export default () => {
    useEffect(() => {
        setTimeout(() => {
            goFullscreen();
        }, 1);
    }, []);

    return <div id="error-updating">
        <Seo title="Updating..." noIndex />
        <Display
            header="Updating..."
            title="We're updating the site."
            description="The site is currently updating, give us a couple minutes then try refreshing."
            showSocials
        />
    </div>;
};

export const getStaticProps: GetStaticProps = async () => {
    return { props: {} };
};
