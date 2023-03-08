import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} from '@discordjs/builders';
import { Validate } from '@qwaroo/common';
import type { Game } from '@qwaroo/server';
import { Games, Scores, Users, getEnv } from '@qwaroo/server';
import type { FetchScoresOptions } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import { ButtonStyle } from 'discord.js';
import _ from 'lodash';
import { Command } from 'maclary';
import { formatScore } from '#/utilities/formatters';

export class GameCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'game',
            description: 'Get information about a game.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],

            options: [
                {
                    name: 'game',
                    description: 'The game to get information about.',
                    type: Command.OptionType.String,
                    required: true,
                    autocomplete: true,
                    minLength: 10,
                },
            ],
        });
    }

    public override async onAutocomplete(autocomplete: Command.Autocomplete) {
        const term = autocomplete.options.getFocused();
        if (term.length < 3) return autocomplete.respond([]);

        const options = { term, limit: 10 };
        const [, games] = await Games.getGames(options);

        return autocomplete.respond(
            games.map(game => ({
                name: game.title,
                value: game.id,
            }))
        );
    }

    public override async onSlash(input: Command.ChatInput) {
        const gameId = input.options.getString('game', true);
        if (!Validate.ObjectId.test(gameId))
            return input.reply({
                content: "Inputted game ID isn't valid.",
                ephemeral: true,
            });

        await input.deferReply();
        const game = await Games.getGame(gameId).catch(() => null);
        if (!game) return input.editReply("Couldn't find a game with that ID.");

        const payload = await this._fetchCreatorAndBuildGame(game);
        const scores = await this._fetchAndBuildScores(game, { limit: 6 });
        const buttons = this._buildButtons(game);

        return input.editReply(
            _.mergeWith(payload, scores, buttons, (a, b) =>
                _.isArray(a) ? a.concat(b) : a
            )
        );
    }

    private async _fetchCreatorAndBuildGame(game: Game.Document) {
        const creator = await game.getCreator();

        const url = new URL(
            WebRoutes.game(game.id),
            getEnv(String, 'WEB_URL')
        ).toString();

        const mainEmbed = new EmbedBuilder()
            .setTitle(game.title)
            .setURL(url)
            .setDescription(game.longDescription)
            .setThumbnail(game.thumbnailUrl)
            .setFooter({
                text: `Created by ${creator.displayName}`,
                iconURL: creator.avatarUrl,
            })
            .setColor(0x3884f8);

        return { embeds: [mainEmbed], components: [] };
    }

    private async _fetchAndBuildScores(
        game: Game.Document,
        options: FetchScoresOptions
    ) {
        const [meta, scores] = await Scores.getScores(game, options);
        if (meta.total === 0) return {};

        const [skip, limit] = [meta.skip ?? 0, meta.limit ?? 9];
        const page = Math.floor(skip / limit) + 1;
        const first = (page - 1) * limit + 1;
        const last = Math.min(page * limit, meta.total);

        const userIds = scores.map(score => score.userId);
        const [, users] = await Users.getUsers({ ids: userIds });
        const findUser = (id: string) => users.find(user => user.id === id)!;

        const url = new URL(
            WebRoutes.game(game.id) + '#scores',
            getEnv(String, 'WEB_URL')
        ).toString();

        const mainEmbed = new EmbedBuilder()
            .setTitle('Highest Scores')
            .setURL(url)
            .setFields(
                scores.map((score, i) => ({
                    name: `${first + i}. ${
                        findUser(score.userId)?.displayName
                    }`,
                    value: formatScore(score, false),
                    inline: true,
                }))
            )
            .setFooter({
                text: `Showing ${first}-${last} of ${meta.total} users.`,
            })
            .setColor(0x3884f8);

        return { embeds: [mainEmbed] };
    }

    private _buildButtons(game: Game.Document) {
        const gameUrl = new URL(
            WebRoutes.game(game.slug),
            getEnv(String, 'WEB_URL')
        ).toString();

        const buttonRow = new ActionRowBuilder<ButtonBuilder>();
        buttonRow.addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(gameUrl)
                .setLabel('Play Game, All Scores'),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`profile,${game.creatorId}`)
                .setLabel('Creator Profile')
        );

        return { components: [buttonRow] };
    }
}
