import { Validate } from '@qwaroo/common';
import { Games, Scores, Users } from '@qwaroo/server';
import { Command } from 'maclary';
import * as Browser from '#/builders/browser';
import * as Common from '#/builders/common';

export class GameLeaderboardCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'leaderboard',
            description: 'View the score leaderboard of a game.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],

            options: [
                {
                    name: 'game',
                    description: 'The game to view the leaderboard of.',
                    type: Command.OptionType.String,
                    autocomplete: true,
                    required: true,
                    minLength: 10,
                },
            ],
        });
    }

    public override async onAutocomplete(autocomplete: Command.Autocomplete) {
        const term = autocomplete.options.getFocused();
        if (term.length < 3) return autocomplete.respond([]);

        const options = { term, limit: 9 };
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
                content: 'The game ID you provided is invalid.',
                ephemeral: true,
            });

        await input.deferReply();
        const game = await Games.getGame(gameId).catch(() => null);
        if (!game) return input.editReply("Couldn't find a game with that ID.");

        const [meta, scores] = await Scores.getScores(game, { limit: 9 });
        const userIds = scores.map(score => score.userId);
        const [, games] = await Users.getUsers({ ids: userIds });

        const params = [scores, games, meta.total] as const;
        const embed = Browser.buildGameScoresEmbed(...params) //
            .setTitle(`Leaderboard for ${game.title}`);

        const buttons = Common.buildComponentRow(
            ...Browser.buildGameScoresBrowserButtons(
                { limit: 9 },
                game.id,
                false,
                meta.total > 9
            )
        );

        return input.editReply({
            embeds: [embed],
            components: [buttons],
        });
    }
}
