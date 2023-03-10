import { Validate } from '@qwaroo/common';
import { Games } from '@qwaroo/server';
import _ from 'lodash';
import { Command } from 'maclary';
import { UserHandler } from '#/classes/UserHandler';

export class PlayCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'play',
            description: 'Play a Qwaroo game on Discord.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],

            options: [
                {
                    name: 'game',
                    description: 'The game to play.',
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
                content: 'The game ID you provided is invalid.',
                ephemeral: true,
            });

        await input.deferReply();
        const game = await Games.getGame(gameId).catch(() => null);
        if (!game) return input.editReply("Couldn't find a game with that ID.");

        const message = await input.editReply(`Preparing **${game.title}**...`);
        const user = await UserHandler.findOrCreateUser(input.user);
        const params = [game, user, input.user, message] as const;
        return this.container.games.create(...params);
    }
}
