import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import type { Game, Score } from '@qwaroo/client';
import { ms } from 'enhanced-ms';
import { PlainButton } from '../Input/PlainButton';

export namespace HighScoreCard {
    export interface Props {
        game: Game;
        score: Score;
        isMe?: boolean;
    }
}

export function HighScoreCard({ game, score, isMe }: HighScoreCard.Props) {
    return <div className="flex p-6 rounded-xl bg-white dark:bg-neutral-800">
        <picture className="hidden sm:block md:hidden lg:block">
            <img
                src={game.thumbnailUrl}
                className="w-32 h-32 object-cover rounded-xl"
            />
        </picture>

        <div className="flex flex-col ml-5 justify-center">
            <h5 className="text-xl font-semibold">{game.title}</h5>

            <span className="text-2xl font-semibold">
                Highscore of {score.highScore}
            </span>

            <span>
                {isMe ? 'You' : 'They'} played {score.totalPlays} time
                {score.totalPlays === 1 ? '' : 's'} over{' '}
                {ms(score.totalTime, { shortFormat: true })},{' '}
                {isMe ? 'your' : 'their'} total score is {score.totalScore}.
            </span>
        </div>

        <PlainButton
            className="ml-auto hover:text-qwaroo-400 text-3xl"
            linkProps={{ href: `/games/${game.slug}` }}
            iconProp={faPlay}
        />
    </div>;
}
