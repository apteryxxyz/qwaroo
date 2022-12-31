import { Game as GameEntity } from '@qwaroo/types';
import { PageSeo } from './Page';

export namespace GameSeo {
    export interface Props extends PageSeo.Props {
        url: string;
        description: string;
        categories: string[];
        mode: GameEntity.Mode | string;
    }
}

export function GameSeo(props: GameSeo.Props) {
    const mode = modeToTitle(props.mode);

    return <PageSeo
        {...props}
        title={`${props.title} - ${mode}`}
        keywords={[props.title, mode, ...props.categories]}
    />;
}

function modeToTitle(mode: GameEntity.Mode | string) {
    switch (mode) {
        case GameEntity.Mode.HigherOrLower:
            return 'Higher or Lower';
        default:
            return 'Unknown';
    }
}
