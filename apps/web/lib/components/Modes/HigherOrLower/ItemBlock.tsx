import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import type { Game as GameEntity } from '@qwaroo/types';
import { Button } from '#/components/Input/Button';

export namespace ItemBlock {
    export type Mode = typeof GameEntity.Mode.HigherOrLower;

    export interface Props
        extends Omit<GameEntity.Item<Mode>, 'value'>,
            GameEntity.Data<Mode> {
        thisSide: 'left' | 'right';
        value: string | React.ReactNode;

        shouldShowValue?: boolean;
        shouldShowActions?: boolean;

        onMoreClick?(): void;
        onLessClick?(): void;

        imageCropping: 'auto' | 'crop' | 'none';
        imageQuality: 'max' | 'reduced';
    }
}

function croppingToFrame(
    cropping: ItemBlock.Props['imageCropping'] = 'auto',
    auto: 'fill' | 'fit' = 'fill'
) {
    switch (cropping) {
        case 'auto':
            return auto;
        case 'crop':
            return 'fill';
        case 'none':
            return 'fit';
        default:
            return auto;
    }
}

function qualityToNumber(quality: ItemBlock.Props['imageQuality'] = 'reduced') {
    switch (quality) {
        case 'max':
            return 100;
        case 'reduced':
            return 10;
        default:
            return 10;
    }
}

export function ItemBlock({
    shouldShowValue = false,
    shouldShowActions = false,
    ...props
}: ItemBlock.Props) {
    const quality = qualityToNumber(props.imageQuality);
    const cropping = croppingToFrame(props.imageCropping, props.imageFrame);

    const imageUrl = new URL('https://wsrv.nl');
    imageUrl.searchParams.set('url', props.imageSource!);
    imageUrl.searchParams.set('q', quality.toString());

    return <aside
        className="h-[50vh] xl:h-screen w-screen xl:w-[50vw] bg-no-repeat text-white
            flex flex-col justify-center items-center p-10 xl:pt-[30vw] select-none"
        style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(${imageUrl})`,
            backgroundSize: cropping === 'fit' ? '100%' : 'cover',
            backgroundPosition: cropping === 'fit' ? '50% 50%' : 'center',
        }}
    >
        <h2 className="text-center text-2xl xl:text-5xl font-bold">
            "{props.display}"
        </h2>

        {props.caption && <span className="text-center">{props.caption}</span>}

        <span className="text-center text-xl">{props.verb}</span>

        {shouldShowValue && <span className="text-center text-4xl xl:text-7xl font-bold">
            {props.prefix}
            {typeof props.value === 'number'
                ? props.value.toLocaleString()
                : props.value}
            {props.suffix}
        </span>}

        {shouldShowActions &&
            props.onMoreClick &&
            props.onLessClick && <div className="flex text-center font-bold text-lg xl:text-3xl">
                <Button
                    className="text-center m-3 p-3 uppercase bg-red-500"
                    whileHover="brightness-125"
                    disableDefaultStyles
                    iconProp={faArrowUp}
                    onClick={props.onMoreClick}
                >
                    {props.higher}
                </Button>

                <Button
                    className="text-center m-3 p-3 uppercase bg-blue-500"
                    whileHover="brightness-125"
                    disableDefaultStyles
                    iconProp={faArrowDown}
                    onClick={props.onLessClick}
                >
                    {props.lower}
                </Button>
            </div>}

        <span className="text-xl">{props.noun}</span>
    </aside>;
}
