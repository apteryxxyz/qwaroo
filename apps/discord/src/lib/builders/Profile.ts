import { URL } from 'node:url';
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} from '@discordjs/builders';
import type { User } from '@qwaroo/server';
import { Games, Scores, getEnv } from '@qwaroo/server';
import type { FetchGamesOptions, FetchScoresOptions } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import { ButtonStyle } from 'discord.js';
import ms from 'enhanced-ms';
import { formatGame, formatScore } from '#/utilities/formatters';

export function buildProfile(user: User.Document) {
    const profileUrl = new URL(
        WebRoutes.user(user.id),
        getEnv(String, 'WEB_URL')
    ).toString();

    const mainEmbed = new EmbedBuilder()
        .setTitle(`${user.displayName}'s Profile`)
        .setDescription(formatJoinDate(user.joinedTimestamp))
        .setURL(profileUrl)
        .setThumbnail(user.avatarUrl)
        .setColor(0x3884f8);

    return { embeds: [mainEmbed] };
}

export async function fetchAndBuildScores(
    user: User.Document,
    options: FetchScoresOptions
) {
    const [meta, scores] = await Scores.getScores(user, options);
    if (meta.total === 0) return;

    const [skip, limit] = [meta.skip ?? 0, meta.limit ?? 9];
    const page = Math.floor(skip / limit) + 1;
    const first = (page - 1) * limit + 1;
    const last = Math.min(page * limit, meta.total);

    const gameIds = scores.map(score => score.gameId);
    const [, games] = await Games.getGames({ ids: gameIds });

    const mainEmbed = new EmbedBuilder()
        .setTitle('Highest Scores')
        .setFields(
            scores.map((score, i) => ({
                name: `${first + i}. ${games[i].title}`,
                value: formatScore(score, score.userId === user.id),
                inline: true,
            }))
        )
        .setFooter({
            text: `Showing ${first}-${last} of ${meta.total} scores.`,
        })
        .setColor(0x3884f8);

    return { embeds: [mainEmbed] };
}

export async function fetchAndBuildGames(
    user: User.Document,
    options: FetchGamesOptions
) {
    const [meta, games] = await Games.getGames(options, user);
    if (meta.total === 0) return;

    const [skip, limit] = [meta.skip ?? 0, meta.limit ?? 9];
    const page = Math.floor(skip / limit) + 1;
    const first = (page - 1) * limit + 1;
    const last = Math.min(page * limit, meta.total);

    const mainEmbed = new EmbedBuilder()
        .setTitle('Created Games')
        .setFields(
            games.map(game => ({
                name: game.title,
                value: formatGame(game),
                inline: true,
            }))
        )
        .setFooter({
            text: `Showing ${first}-${last} of ${meta.total} games.`,
        })
        .setColor(0x3884f8);

    return { embeds: [mainEmbed] };
}

export function buildButtons(user: User.Document) {
    const userUrl = new URL(
        WebRoutes.user(user.id),
        getEnv(String, 'WEB_URL')
    ).toString();

    const buttonRow = new ActionRowBuilder<ButtonBuilder>();
    buttonRow.addComponents(
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(userUrl)
            .setLabel('Full Profile, All Scores, All Created Games')
    );

    return { components: [buttonRow] };
}

function formatJoinDate(joinedTimestamp: number) {
    const atString = new Date(joinedTimestamp).toLocaleDateString('en-NZ');
    const timeAgo = ms(Date.now() - joinedTimestamp, { roundUp: true });
    return `Joined ${atString}, about ${timeAgo} ago.`;
}
