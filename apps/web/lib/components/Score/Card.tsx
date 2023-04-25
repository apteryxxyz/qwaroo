import type { Game, Score, User } from '@qwaroo/client';
import { WebRoutes } from '@qwaroo/types';
import { ms } from 'enhanced-ms';
import Link from 'next/link';
import { Card } from '../Card';
import { useClient } from '#/contexts/Client';

export function ScoreCard(props: ScoreCard.Props) {
    // Private games dont have a user or game
    if (!props.user && !props.game) return null;

    const client = useClient();

    const isMe = client.id === props.score.userId;
    const titleUrl = props.game
        ? WebRoutes.game(props.game.slug)
        : WebRoutes.user(props.user!.id);

    return <Card>
        <h3 className="font-semibold text-lg">
            <Link href={titleUrl} className="text-qwaroo-500">
                {props.game?.title ?? props.user?.displayName}
            </Link>
            <br />
            Highscore of {props.score.highScore}
        </h3>

        <p>
            {isMe ? 'You' : 'They'} played {props.score.totalPlays} time
            {props.score.totalPlays === 1 ? '' : 's'} over{' '}
            {ms(props.score.totalTime, { shortFormat: true })},{' '}
            {isMe ? 'your' : 'their'} total score is {props.score.totalScore}.
        </p>
    </Card>;
}

export namespace ScoreCard {
    export interface Props {
        score: Score;
        user?: User;
        game?: Game;
    }
}
