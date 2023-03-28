import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import type { Game } from '@qwaroo/client';
import Link from 'next/link';
import type { Embed } from './Embed';
import { Button } from '#/components/Input/Button';
import { proxifyImageUrl } from '#/utilities/url';

export function Block(props: Block.Props) {
    const quality = Block.qualityToNumber(props.imageQuality);
    const frame = Block.croppingToFrame(props.imageCropping, props.imageFrame);

    const imageUrl = new URL(props.imageSource!);
    const proxyUrl = proxifyImageUrl(imageUrl, quality);

    return <aside
        className="relative h-[50vh] xl:h-screen w-screen xl:w-[50vw] bg-no-repeat text-white
            flex flex-col justify-center items-center p-10 xl:pt-[30vw] select-none bg-neutral-200 dark:bg-neutral-900"
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

        {props.showValue && <span className="text-center text-4xl xl:text-7xl font-bold">
            {props.valuePrefix}
            {typeof props.value === 'number'
                ? props.value.toLocaleString()
                : props.value}
            {props.valueSuffix}
        </span>}

        {props.showActions &&
            props.onHigherClick &&
            props.onLowerClick && <div className="flex text-center font-bold text-lg xl:text-3xl">
                <Button
                    className="text-center m-3 p-3 !bg-red-500 uppercase"
                    iconProp={faArrowUp}
                    onClick={props.onHigherClick}
                >
                    {props.higherText}
                </Button>
                <Button
                    className="text-center m-3 p-3 !bg-blue-500 uppercase"
                    iconProp={faArrowDown}
                    onClick={props.onLowerClick}
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

export namespace Block {
    export interface Props
        extends Omit<Game.Item<Embed.Mode>, 'value'>,
            Game.Extra<Embed.Mode>,
            Embed.Settings {
        value: number | React.ReactNode;
        showValue?: boolean;
        showActions?: boolean;
        onHigherClick?(): void;
        onLowerClick?(): void;
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
