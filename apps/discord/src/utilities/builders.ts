import { EmbedBuilder } from '@discordjs/builders';
import type { Game, Score, User } from '@qwaroo/server';
import { getEnv } from '@qwaroo/server';
import { WebRoutes } from '@qwaroo/types';
import { formatGame, formatScore } from './formatters';

export function buildGamesEmbed(
    games: Game.Document[],
    total: number,
    user?: User.Document
) {
    const gamesUrl = new URL(
        (user ? WebRoutes.user(user.id) : WebRoutes.games()) +
            `#${Math.floor(Math.random() * 100)}`,
        getEnv(String, 'WEB_URL')
    ).toString();

    return new EmbedBuilder()
        .setURL(gamesUrl)
        .setFields(
            games.map(game => ({
                name: game.title,
                value: formatGame(game),
                inline: true,
            }))
        )
        .setFooter({ text: `Showing ${games.length} of ${total} games.` })
        .setColor(0x3884f8);
}

export function buildScoresEmbed(
    scores: Score.Document[],
    total: number,
    games: Game.Document[],
    me?: User.Document
) {
    const scoresUrl = new URL(
        WebRoutes.user(scores[0]?.userId) +
            `#${Math.floor(Math.random() * 100)}`,
        getEnv(String, 'WEB_URL')
    ).toString();

    return new EmbedBuilder()
        .setURL(scoresUrl)
        .setFields(
            scores.map((score, i) => ({
                name: games[i]?.title ?? 'Unknown Game',
                value: formatScore(score, score.userId === me?.id),
                inline: true,
            }))
        )
        .setFooter({ text: `Showing ${scores.length} of ${total} scores.` })
        .setColor(0x3884f8);
}
