import { WebRoutes } from '@qwaroo/types';
import { GameBrowser } from '#/components/Game/Browser';
import { PageSeo } from '#/components/Seo/Page';
import { useClient } from '#/hooks/useClient';

export default () => {
    const client = useClient();

    return <>
        <PageSeo
            url={WebRoutes.games()}
            title="Games"
            description="Explore our collection of exciting guessing and statistics-based games!
            Can you guess which country has a higher population, or which movie has a better rating on IMDb?
            Find out today!"
        />

        <h2>Game Modes</h2>

        {/* Games grid */}
        <GameBrowser manager={client.games} enablePathQuery />
    </>;
};
