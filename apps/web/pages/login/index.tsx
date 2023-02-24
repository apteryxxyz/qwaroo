import { faDiscord, faReddit } from '@fortawesome/free-brands-svg-icons';
import { APIRoutes, WebRoutes } from '@qwaroo/types';
import { Button } from '#/components/Input/Button';
import { PageSeo } from '#/components/Seo';
import { getApiUrl } from '#/utilities/env';

export default () => {
    return <>
        <PageSeo
            url={WebRoutes.login()}
            title="Login"
            description="Login to Qwaroo"
        />

        <h2>Login / Sign Up</h2>

        <p>
            Welcome! Login to save your statistics, achievements, and to create
            your own games!
        </p>

        <div className="flex flex-col gap-3">
            <Button
                className="bg-[#5865F2]"
                iconProp={faDiscord}
                linkProps={{
                    href: new URL(APIRoutes.authLogin('discord'), getApiUrl()),
                }}
            >
                Sign in with Discord
            </Button>

            <Button
                className="bg-[#FF5700]"
                iconProp={faReddit}
                linkProps={{
                    href: new URL(APIRoutes.authLogin('reddit'), getApiUrl()),
                }}
            >
                Sign in with Reddit
            </Button>
        </div>
    </>;
};
