import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import type { Game } from '@qwaroo/client';
import Link from 'next/link';
import { Button } from '#/components/Input/Button';

export function ItemBlock(props: ItemBlock.Props) {
    const quality = ItemBlock.qualityToNumber(props.imageQuality);
    const frame = ItemBlock.croppingToFrame(
        props.imageCropping,
        props.imageFrame
    );

    const imageUrl = new URL(props.imageSource!);
    const proxyUrl = new URL('https://wsrv.nl');
    proxyUrl.searchParams.set('url', imageUrl.toString());
    proxyUrl.searchParams.set('q', quality.toString());

    return <aside
        className="relative h-[50vh] xl:h-screen w-screen xl:w-[50vw] bg-no-repeat text-white
            flex flex-col justify-center items-center p-10 xl:pt-[30vw] select-none"
        style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(${proxyUrl})`,
            backgroundSize: frame === 'fit' ? 'contain' : 'cover',
            backgroundPosition: 'center',
        }}
    >
        <h2 className="text-center text-2xl xl:text-5xl font-bold">
            "{props.display}"
        </h2>

        {props.caption && <p className="text-center text-xl">
            {props.caption}
        </p>}

        <span className="text-center text-xl">{props.valueVerb}</span>

        {props.shouldShowValue && <span className="text-center text-4xl xl:text-7xl font-bold">
            {props.valuePrefix}
            {typeof props.value === 'number'
                ? props.value.toLocaleString()
                : props.value}
            {props.valueSuffix}
        </span>}

        {props.shouldShowActions &&
            props.onMoreClick &&
            props.onLessClick && <div className="flex uppercase text-center font-bold text-lg xl:text-3xl">
                <Button
                    className="text-center m-3 p-3 bg-red-500 hover:bg-red-600"
                    iconProp={faArrowUp}
                    onClick={props.onMoreClick}
                >
                    {props.higherText}
                </Button>
                <Button
                    className="text-center m-3 p-3 bg-blue-500 hover:bg-blue-600"
                    iconProp={faArrowDown}
                    onClick={props.onLessClick}
                >
                    {props.lowerText}
                </Button>
            </div>}

        <span className="text-xl">{props.valueNoun}</span>

        <span className="absolute right-1 bottom-1 opacity-30">
            image via{' '}
            <Link
                href={imageUrl.toString()}
                target="_blank"
                className="underline"
            >
                {imageUrl.hostname}
            </Link>
        </span>
    </aside>;
}

export namespace ItemBlock {
    export interface Props
        extends Omit<Game.Item<typeof Game.Mode.HigherOrLower>, 'value'>,
            Game.Extra<typeof Game.Mode.HigherOrLower> {
        value: number | React.ReactNode;

        shouldShowValue?: boolean;
        shouldShowActions?: boolean;

        onMoreClick?(): void;
        onLessClick?(): void;

        imageCropping: 'crop' | 'none' | 'auto';
        imageQuality: 'max' | 'reduced';
    }

    export function croppingToFrame(
        cropping: 'crop' | 'none' | 'auto' = 'auto',
        auto: 'fit' | 'fill' = 'fill'
    ) {
        switch (cropping) {
            case 'crop':
                return 'fill';
            case 'none':
                return 'fit';
            default:
                return auto;
        }
    }

    export function qualityToNumber(quality: 'max' | 'reduced' = 'reduced') {
        return quality === 'max' ? 100 : 20;
    }
}
