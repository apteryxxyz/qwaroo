import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons/faWandMagicSparkles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Game, User } from '@qwaroo/client';
import { WebRoutes } from '@qwaroo/types';
import Link from 'next/link';
import { proxifyImageUrl } from '#/utilities/url';

export function GameCard({ game, creator }: GameCard.Props) {
    const [badgeText, badgeIcon] = generateGameBagde(game);

    return <Link
        href={WebRoutes.game(game.slug)}
        className="flex flex-col w-auto h-auto aspect-square rounded-xl shadow-xl
            transition-all duration-300 ease-in-out text-white
            hover:shadow-lg hover:brightness-125"
        style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3),
                rgba(0,0,0,0.3)),url(${proxifyImageUrl(
                    game.thumbnailUrl,
                    80,
                    900
                )})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
        <div
            className="flex flex-col gap-2 absolute mt-2 -m-2 text-sm font-bold uppercase
        [&>*]:px-3 [&>*]:py-2 [&>*]:rounded-md [&>*]:drop-shadow-[0_4px_3px_rgba(0,0,0,.25)] [&>*]:w-fit"
        >
            {badgeText && <span className="bg-qwaroo-gradient">
                {badgeIcon && <FontAwesomeIcon icon={badgeIcon} />} {badgeText}
            </span>}
        </div>

        <section
            className="flex flex-col justify-end w-full min-h-[40%] mt-auto p-3
                bg-gradient-to-t from-black to-transparent rounded-b-xl"
        >
            <h3 className="text-1.5xl font-semibold">{game.title}</h3>
            <p className="overflow-hidden">{game.shortDescription}</p>

            <span className="flex text-sm">
                <span>{game.modeName}</span>

                {creator?.displayName && <>
                    <span className="mx-1">•</span>
                    <object>
                        <Link href={WebRoutes.user(creator.id)}>
                            Created by {creator.displayName}
                        </Link>
                    </object>
                </>}
            </span>
        </section>
    </Link>;
}

export namespace GameCard {
    export interface Props {
        game: Game;
        creator?: User;
    }
}

function generateGameBagde(game: Game) {
    const sevenDays = 1_000 * 60 * 60 * 24 * 7;
    if (game.createdTimestamp > Date.now() - sevenDays)
        return ['New', faWandMagicSparkles] as const;
    else if (game.updatedTimestamp > Date.now() - sevenDays)
        return ['Updated', faPen] as const;
    else return [null, null] as const;
}
