import { URL } from 'node:url';
import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { User, getEnv } from '@qwaroo/server';
import { WebRoutes } from '@qwaroo/types';
import { ButtonStyle } from 'discord.js';
import { getEmoji } from '#/utilities/emotes';

export function buildProfile(user: User.Document) {
    return new EmbedBuilder()
        .setTitle(`${user.displayName}'s Profile`)
        .setDescription(formatJoinDate(user.joinedTimestamp))
        .addFields({
            name: 'Badges',
            value: formatFlags(user.flags),
        })
        .setThumbnail(user.avatarUrl)
        .setColor(0x3884f8);
}

function formatJoinDate(joinedTimestamp: number) {
    const realTime = Math.round(joinedTimestamp / 1_000);
    return `Joined <t:${realTime}:d>, about <t:${realTime}:R>.`;
}

function formatFlags(flags: number) {
    return (
        (['Developer', 'Moderator', 'Verified'] as const)
            .map(name =>
                (flags & User.Flags[name]) > 0
                    ? `${getEmoji(name.toLowerCase())} ${name}`
                    : ''
            )
            .join(' ')
            .trim() || 'None'
    );
}

export function buildButtons(user: User.Document) {
    const profileUrl = new URL(
        WebRoutes.user(user.id),
        getEnv(String, 'WEB_URL')
    ).toString();

    return [
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(profileUrl)
            .setLabel('View on Web'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`user,${user.id},scores`)
            .setLabel('Game Scores'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`user,${user.id},games`)
            .setLabel('Created Games'),
    ];
}
