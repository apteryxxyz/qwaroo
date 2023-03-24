/* eslint-disable @typescript-eslint/no-explicit-any */
import { URL } from 'node:url';
import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { Game, User } from '@qwaroo/server';
import { getEnv } from '@qwaroo/server';
import { WebRoutes } from '@qwaroo/types';
import { ButtonStyle } from 'discord.js';
import { encodeOptions } from './browser';

// Game Information

export function buildInformationEmbed(
    game: Game.Document,
    creator: User.Document
) {
    return new EmbedBuilder()
        .setTitle(game.title)
        .setDescription(formatDescription(game, creator))
        .setThumbnail(game.thumbnailUrl)
        .setFooter({
            text: `Created by ${creator.displayName}`,
            iconURL: creator.avatarUrl,
        })
        .setColor(0x3884f8);
}

export function formatDescription(game: Game.Document, creator: User.Document) {
    const realCreationTime = Math.round(game.createdTimestamp / 1_000);
    const realLastPlayedTime = Math.round(game.lastPlayedTimestamp / 1_000);
    return `${game.longDescription} Created by ${creator.displayName}, on <t:${realCreationTime}:d>, about <t:${realCreationTime}:R>, last played around <t:${realLastPlayedTime}:R>.`;
}

export function buildInformationButtons(game: Game.Document) {
    const gameUrl = new URL(
        WebRoutes.game(game.slug),
        getEnv(String, 'WEB_URL')
    ).toString();

    return [
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(gameUrl)
            .setLabel('Play on Web'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`game,${game.id},play`)
            .setLabel('Play Now'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`user,${game.creatorId},profile`)
            .setLabel('Creator Profile'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(
                `browser,game_scores,${game.id},${encodeOptions({})},start`
            )
            .setLabel('Score Leaderboard'),
    ];
}
