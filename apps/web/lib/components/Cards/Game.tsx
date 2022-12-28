import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons/faWandMagicSparkles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Game, User } from '@qwaroo/client';
import type { Game as GameEntity } from '@qwaroo/types';
import Link, { type LinkProps } from 'next/link';

export namespace GameCard {
    export interface Props {
        game: Game;
        creator?: User;

        linkProps?: LinkProps;
        badgeText?: string;
        disableBadge?: boolean;
    }
}

const modeNameMap: Record<GameEntity.Mode, string> = {
    'higher-or-lower': 'Higher or Lower',
};

export function GameCard({ game, creator, ...props }: GameCard.Props) {
    let badgeText = props.badgeText;
    let badgeIcon: IconProp | null = null;

    if (!badgeText && !props.disableBadge) {
        const sevenDays = 7 * 24 * 60 * 60 * 1_000;
        if (game.createdTimestamp > Date.now() - sevenDays) {
            badgeText = 'New';
            badgeIcon = faWandMagicSparkles;
        } else if (game.updatedTimestamp > Date.now() - sevenDays) {
            badgeText = 'Updated';
            badgeIcon = faPen;
        }
    }

    const imageUrl = new URL('https://wsrv.nl');
    imageUrl.searchParams.set('url', game.thumbnailUrl);
    imageUrl.searchParams.set('q', '20');

    return <Link
        href={`/games/${game.slug}`}
        {...props.linkProps}
        className="flex flex-col w-auto h-auto aspect-square rounded-xl
            transition-all duration-300 ease-in-out text-white
            hover:shadow-lg hover:scale-105 hover:brightness-125"
        style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3),
                rgba(0,0,0,0.3)),url(${imageUrl.toString()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
        // Rotate the card randomly on hover
        onMouseEnter={event => {
            const element = event.currentTarget;
            element.style.rotate = `${
                Math.round(Math.random()) === 0 ? -1 : 1
            }deg`;
        }}
        onMouseLeave={event => {
            const element = event.currentTarget;
            element.style.rotate = '0deg';
        }}
    >
        <div
            className="flex flex-col gap-2 absolute mt-2 -m-2 text-sm font-bold uppercase
            [&>*]:px-3 [&>*]:py-2 [&>*]:rounded-md [&>*]:drop-shadow-[0_4px_3px_rgba(0,0,0,.25)] [&>*]:w-fit"
        >
            {badgeText &&
                !props.disableBadge && <span className="bg-qwaroo-gradient">
                    {badgeIcon && <FontAwesomeIcon icon={badgeIcon} />}{' '}
                    {badgeText}
                </span>}
        </div>

        <section
            className="flex flex-col justify-end w-full min-h-[40%] mt-auto p-3
                bg-gradient-to-t from-black to-transparent rounded-b-xl"
        >
            <h3 className="text-1.5xl font-semibold">{game.title}</h3>
            <p className="overflow-hidden">{game.shortDescription}</p>

            <span className="flex text-sm">
                <span>{modeNameMap[game.mode]}</span>

                {creator?.displayName && <>
                    <span className="mx-1">•</span>
                    {/* Use the object tag to bypass the a in a tag stuff */}
                    <object>
                        <Link
                            href={`/users/${creator.id}`}
                            className="opacity-80 hover:opacity-100"
                        >
                            Created by {creator.displayName}
                        </Link>
                    </object>
                </>}
            </span>
        </section>
    </Link>;
}
