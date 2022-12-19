import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons/faWandMagicSparkles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Game, User } from '@owenii/client';
import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export namespace GameCard {
    export interface Props {
        game: Game;
        creator?: User;

        linkProps?: LinkProps;
        badgeText?: string;
        disableBadge?: boolean;
    }
}

export function GameCard({ game, creator, ...props }: GameCard.Props) {
    const router = useRouter();

    useEffect(() => {
        localStorage.setItem('owenii.back_to', router.asPath);
    }, []);

    let badgeText = props.badgeText;
    let badgeIcon: IconProp | null = null;

    if (!badgeText && !props.disableBadge) {
        const sevenDays = 7 * 24 * 60 * 60 * 1_000;
        if (game.createdTimestamp > Date.now() - sevenDays) {
            badgeText = 'NEW';
            badgeIcon = faWandMagicSparkles;
        } else if (game.updatedTimestamp > Date.now() - sevenDays) {
            badgeText = 'UPDATED';
            badgeIcon = faPen;
        }
    }

    return <Link
        href={`/games/${game.slug}`}
        {...props.linkProps}
        className="flex flex-col w-auto h-auto aspect-square rounded-xl
            transition-all duration-300 ease-in-out text-white
            hover:shadow-lg hover:scale-105 hover:brightness-125"
        style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3),
                rgba(0,0,0,0.3)),url(${game.thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
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
        {badgeText && !props.disableBadge && <span
            className="absolute mt-2 -m-2 px-5 py-2 rounded-md font-bold
                drop-shadow-[0_4px_3px_rgba(0,0,0,.25)] bg-sky-500"
        >
            {badgeIcon && <FontAwesomeIcon icon={badgeIcon} />} {badgeText}
        </span>}

        <div
            className="flex flex-col justify-end w-full min-h-[30%] mt-auto p-3
                bg-gradient-to-t from-black to-transparent rounded-b-xl"
        >
            <h2 className="text-1.5xl font-semibold">{game.title}</h2>
            <p className="overflow-hidden">{game.shortDescription}</p>
            {creator && <object>
                <Link
                    href={`/users/${creator.id}`}
                    className="overflow-hidden opacity-70 transition-all hover:opacity-100"
                >
                    Created by {creator.displayName}
                </Link>
            </object>}
        </div>
    </Link>;
}
