import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} from '@discordjs/builders';
import type { User } from '@qwaroo/server';
import { Games, Scores, getEnv } from '@qwaroo/server';
import type { FetchGamesOptions, FetchScoresOptions } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import { ApplicationCommandOptionType, ButtonStyle } from 'discord.js';
import ms from 'enhanced-ms';
import _ from 'lodash';
import { Command } from 'maclary';
import { Handler } from '#/structures/Handler';
import { formatGame, formatScore } from '#/utilities/formatters';

export class ProfileCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'profile',
            description: 'Get the Qwaroo profile of a user.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],

            options: [
                {
                    name: 'user',
                    description: 'The user to get the profile of.',
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await input.deferReply();

        const userId = input.options.getUser('user')?.id ?? input.user.id;
        const user = await Handler.getUserFromAccountId(userId);

        const msg = "User doesn't have a profile yet.";
        if (!user) return input.editReply(msg);

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
        const scores = await this._fetchAndBuildScores(user, { limit: 6 });
        const games = await this._fetchAndBuildGames({ limit: 9 });

        const buttonRow = new ActionRowBuilder<ButtonBuilder>();
        buttonRow.addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('View Full Profile')
                .setURL(profileUrl)
        );

        return input.editReply(
            _.mergeWith(
                { embeds: [mainEmbed], components: [buttonRow] },
                scores,
                games,
                (a, b) => (_.isArray(a) ? a.concat(b) : a)
            )
        );
    }

    private async _fetchAndBuildScores(
        user: User.Document,
        options: FetchScoresOptions
    ) {
        const [meta, scores] = await Scores.getScores(user, options);
        if (meta.total === 0) return {};

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
                }))
            )
            .setFooter({
                text: `Showing ${first}-${last} of ${meta.total} games.`,
            })
            .setColor(0x3884f8);

        return { embeds: [mainEmbed] };
    }

    private async _fetchAndBuildGames(options: FetchGamesOptions) {
        const [meta, games] = await Games.getGames(options);
        if (meta.total === 0) return {};

        const [skip, limit] = [meta.skip ?? 0, meta.limit ?? 9];
        const page = Math.floor(skip / limit) + 1;
        const first = (page - 1) * limit + 1;
        const last = Math.min(page * limit, meta.total);

        const mainEmbed = new EmbedBuilder()
            .setTitle('Games')
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
}

function formatJoinDate(joinedTimestamp: number) {
    const atString = new Date(joinedTimestamp).toLocaleDateString('en-NZ');
    const timeAgo = ms(Date.now() - joinedTimestamp, { roundUp: true });
    return `Joined ${atString}, about ${timeAgo} ago.`;
}
