import { Games } from '@qwaroo/server';
import { Command } from 'maclary';
import { buildGamesEmbed } from '#/utilities/builders';

export class GamesCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'games',
            description: 'Get a list of games you can play.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await input.deferReply();

        const [gamesMeta, games] = await Games.getGames({ limit: 9 });
        if (gamesMeta.total === 0)
            return input.editReply('No games could be found.');

        const gamesEmbed = buildGamesEmbed(games, gamesMeta.total) //
            .setTitle('Games');
        return input.editReply({ embeds: [gamesEmbed] });
    }
}
