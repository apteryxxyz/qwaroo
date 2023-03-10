/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from 'node:buffer';
import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { Score, User } from '@qwaroo/server';
import { Game } from '@qwaroo/server';
import type { FetchGamesOptions, FetchScoresOptions } from '@qwaroo/types';
import { ButtonStyle } from 'discord.js';
import { ms } from 'enhanced-ms';

// Browser

export function encodeOptions(options: Record<string | number | symbol, any>) {
    return Buffer.from(JSON.stringify(options)).toString('base64');
}

export function decodeOptions<T extends FetchGamesOptions | FetchScoresOptions>(
    raw: string
) {
    return JSON.parse(Buffer.from(raw, 'base64').toString()) as T;
}

export function createPageOptions(
    baseOptions: FetchGamesOptions | FetchScoresOptions,
    pageDirection: -1 | 0 | 1 = 1
) {
    return {
        ...baseOptions,
        skip:
            (baseOptions.skip ?? 0) + (baseOptions.limit ?? 9) * pageDirection,
    };
}

// Games

export function buildGamesEmbed(
    games: Game.Document[],
    total: number,
    skip = 0,
    limit = 9
) {
    const page = Math.floor(skip / limit) + 1;
    const first = (page - 1) * limit + (games.length > 0 ? 1 : 0);
    const last = Math.min(page * limit, total);

    return new EmbedBuilder()
        .setTitle('Games')
        .setFields(
            games.map(game => ({
                name: game.title,
                value: formatGame(game),
                inline: true,
            }))
        )
        .setFooter({
            text: `Showing ${first}-${last} of ${total} games.`,
        })
        .setColor(0x3884f8);
}

function formatGame(game: Game.Document) {
    return `${game.shortDescription}\n*${Game.ModeNames[game.mode]}*`;
}

export function buildGameBrowserButtons(
    options: FetchGamesOptions,
    userId = '',
    backEnabled = false,
    nextEnabled = false
) {
    const prefix = `browser,games,${userId},${encodeOptions(options)}`;

    return [
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`${prefix},back`)
            .setLabel('Back')
            .setDisabled(!backEnabled),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`${prefix},next`)
            .setLabel('Next')
            .setDisabled(!nextEnabled),
    ];
}

// User Scores

export function buildUserScoresEmbed(
    scores: Score.Document[],
    games: Game.Document[],
    total: number,
    skip = 0,
    limit = 9
) {
    const page = Math.floor(skip / limit) + 1;
    const first = (page - 1) * limit + (scores.length > 0 ? 1 : 0);
    const last = Math.min(page * limit, total);

    return new EmbedBuilder()
        .setTitle('Scores')
        .setFields(
            scores.map(score => ({
                name:
                    games.find(game => game.id === score.gameId)?.title ??
                    'Unknown',
                value: formatScore(score),
                inline: true,
            }))
        )
        .setFooter({
            text: `Showing ${first}-${last} of ${total} scores.`,
        })
        .setColor(0x3884f8);
}

function formatScore(score: Score.Document, isMe?: boolean) {
    return `**Highscore of ${score.highScore}**\n${
        isMe ? 'You' : 'They'
    } played ${score.totalPlays} time${
        score.totalPlays === 1 ? '' : 's'
    } over ${ms(score.totalTime, { shortFormat: true })}, ${
        isMe ? 'your' : 'their'
    } total score is ${score.totalScore}.`;
}

export function buildUserScoresBrowserButtons(
    options: FetchScoresOptions,
    userId = '',
    backEnabled = false,
    nextEnabled = false
) {
    const prefix = `browser,user_scores,${userId},${encodeOptions(options)}`;

    return [
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`${prefix},back`)
            .setLabel('Back')
            .setDisabled(!backEnabled),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`${prefix},next`)
            .setLabel('Next')
            .setDisabled(!nextEnabled),
    ];
}

// Game Scores

export function buildGameScoresEmbed(
    scores: Score.Document[],
    users: User.Document[],
    total: number,
    skip = 0,
    limit = 9
) {
    const page = Math.floor(skip / limit) + 1;
    const first = (page - 1) * limit + (scores.length > 0 ? 1 : 0);
    const last = Math.min(page * limit, total);

    return new EmbedBuilder()
        .setTitle('Scores')
        .setFields(
            scores.map(score => ({
                name:
                    users.find(user => user.id === score.userId)?.displayName ??
                    'Unknown',
                value: formatScore(score, false),
                inline: true,
            }))
        )
        .setFooter({
            text: `Showing ${first}-${last} of ${total} scores.`,
        })
        .setColor(0x3884f8);
}

export function buildGameScoresBrowserButtons(
    options: FetchScoresOptions,
    gameId = '',
    backEnabled = false,
    nextEnabled = false
) {
    const prefix = `browser,game_scores,${gameId},${encodeOptions(options)}`;

    return [
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`${prefix},back`)
            .setLabel('Back')
            .setDisabled(!backEnabled),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`${prefix},next`)
            .setLabel('Next')
            .setDisabled(!nextEnabled),
    ];
}
