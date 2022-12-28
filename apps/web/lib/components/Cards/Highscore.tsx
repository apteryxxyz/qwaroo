import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import type { Game, Score } from '@qwaroo/client';
import { ms } from 'enhanced-ms';
import { PlainButton } from '../Input/PlainButton';

export namespace HighscoreCard {
    export interface Props {
        game: Game;
        score: Score;
        isMe?: boolean;
    }
}

export function HighscoreCard({ game, score, isMe }: HighscoreCard.Props) {
    const imageUrl = new URL('https://wsrv.nl');
    imageUrl.searchParams.set('url', game.thumbnailUrl);
    imageUrl.searchParams.set('q', '20');

    return <section className="flex p-6 rounded-xl bg-white dark:bg-neutral-800">
        <picture className="hidden sm:block md:hidden lg:block">
            <img
                src={imageUrl.toString()}
                alt={`Thumbnail of ${game.title}`}
                className="w-32 h-32 object-cover rounded-xl"
            />
        </picture>

        <div className="flex flex-col ml-5 justify-center">
            <h3 className="text-xl font-semibold">{game.title}</h3>

            <span className="text-2xl font-semibold">
                Highscore of {score.highScore ?? 0}
            </span>

            <p>
                {isMe ? 'You' : 'They'} played {score.totalPlays} time
                {score.totalPlays === 1 ? '' : 's'} over{' '}
                {ms(score.totalTime, { shortFormat: true })},{' '}
                {isMe ? 'your' : 'their'} total score is {score.totalScore}.
            </p>
        </div>

        <PlainButton
            className="ml-auto hover:text-qwaroo-400 text-3xl"
            linkProps={{ href: `/games/${game.slug}` }}
            iconProp={faPlay}
        />
    </section>;
}
