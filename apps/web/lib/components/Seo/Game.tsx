import { Game } from '@qwaroo/client';
import { type APIGame, WebRoutes } from '@qwaroo/types';
import { PageSeo } from './Page';
import { proxifyImageUrl } from '#/utilities/url';

export function GameSeo(props: GameSeo.Props) {
    return <PageSeo
        {...props}
        url={WebRoutes.game(props.game.slug)}
        title={`${props.game.title} - ${Game.ModeNames[props.game.mode]}`}
        description={props.game.longDescription}
        banner={{
            source: proxifyImageUrl(props.game.thumbnailUrl, 80, 900),
            width: 900,
            height: 900,
        }}
        keywords={[
            props.game.title,
            Game.ModeNames[props.game.mode],
            ...props.game.categories,
        ]}
        noIndex={(props.game.flags & Game.Flags.Public) === 0}
    />;
}

export namespace GameSeo {
    export interface Props extends Partial<PageSeo.Props> {
        game: APIGame;
    }
}
