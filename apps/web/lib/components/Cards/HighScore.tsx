import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import type { Game, Score } from '@owenii/client';
import { ms } from 'enhanced-ms';
import Link from 'next/link';
import { PlainButton } from '../Input/PlainButton';

export namespace HighScoreCard {
    export interface Props {
        game: Game;
        score: Score;
    }
}

export function HighScoreCard({ game, score }: HighScoreCard.Props) {
    return <div className="flex p-6 rounded-xl bg-white dark:bg-neutral-800">
        <Link
            href={`/games/${game.slug}`}
            className="hidden sm:block md:hidden lg:block w-32 h-32"
        >
            <picture>
                <img
                    src={game.thumbnailUrl}
                    className="w-auto h-auto aspect-square rounded-xl bg-cover bg-center"
                />
            </picture>
        </Link>

        <div className="flex flex-col ml-5 justify-center">
            <h5 className="font-bold">{game.title}</h5>

            <span className="flex text-2xl font-semibold">
                Highscore of {score.highScore}
            </span>

            <span>
                You played {score.totalPlays} times over {ms(score.totalTime)},
                your total score is {score.totalScore}.
            </span>
        </div>

        <PlainButton
            className="ml-auto hover:text-sky-400 text-3xl"
            linkProps={{ href: `/games/${game.slug}` }}
            iconProp={faPlay}
        />
    </div>;
}
