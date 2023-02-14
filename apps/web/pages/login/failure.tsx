import { WebRoutes } from '@qwaroo/types';
import { Display } from '#/components/Display/Display';
import { Button } from '#/components/Input/Button';
import { Seo } from '#/components/Seo';

export default () => {
    return <>
        <Seo title="Login Failed" noIndex />

        <Display
            header="Login Failed"
            title="Could not log you in."
            description="Please try again. If the problem persists, please contact us on Discord."
            showSocials
        >
            <Button linkProps={{ href: WebRoutes.login() }}>Try Again</Button>
        </Display>
    </>;
};
