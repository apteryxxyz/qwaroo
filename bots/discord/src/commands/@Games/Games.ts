import { Games } from '@qwaroo/server';
import { Command } from 'maclary';
import * as Browser from '#/builders/browser';
import * as Common from '#/builders/common';

export class GamesCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'games',
            description: 'View a list of games you can play.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await input.deferReply();

        const [meta, games] = await Games.getGames({ limit: 9 });
        const embed = Browser.buildGamesEmbed(games, meta.total);
        const buttons = Common.buildComponentRow(
            ...Browser.buildGameBrowserButtons(
                { limit: 9 },
                '',
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
