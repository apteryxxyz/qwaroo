import { Validate } from '@qwaroo/common';
import { Games } from '@qwaroo/server';
import { Command } from 'maclary';
import * as Common from '#/builders/common';
import * as Gameplay from '#/builders/gameplay';

export class InformationCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'information',
            description: 'Get the general information of a game.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],

            options: [
                {
                    name: 'game',
                    description: 'The game to get information for.',
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

        const creator = await game.getCreator();

        const embed = Gameplay.buildInformationEmbed(game, creator);
        const buttons = Common.buildComponentRow(
            ...Gameplay.buildInformationButtons(game)
        );

        return input.editReply({
            embeds: [embed],
            components: [buttons],
        });
    }
}
