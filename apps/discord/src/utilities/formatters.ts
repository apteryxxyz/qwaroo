import type { Score } from '@qwaroo/server';
import { Game } from '@qwaroo/server';
import { ms } from 'enhanced-ms';

export function formatGame(game: Game.Document) {
    return `${game.shortDescription}\n*${Game.ModeNames[game.mode]}*`;
}

export function formatScore(score: Score.Document, isMe: boolean) {
    return `**Highscore of ${score.highScore}**\n${
        isMe ? 'You' : 'They'
    } played ${score.totalPlays} time${
        score.totalPlays === 1 ? '' : 's'
    } over ${ms(score.totalTime, { shortFormat: true })}, ${
        isMe ? 'your' : 'their'
    } total score is ${score.totalScore}.`;
}
