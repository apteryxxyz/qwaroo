import { Games } from '@qwaroo/server';
import { Command } from 'maclary';
import * as Browser from '#/builders/browser';
import * as Common from '#/builders/common';
import { UserHandler } from '#/classes/UserHandler';

export class UserGamesCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'games',
            description:
                'View a list of games that a user, or yourself, has created.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],

            options: [
                {
                    name: 'user',
                    description: 'The user to view the games of.',
                    type: Command.OptionType.User,
                    required: false,
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await input.deferReply();

        const userId = input.options.getUser('user')?.id ?? input.user.id;
        const user = await UserHandler.getUserFromAccountId(userId);
        if (!user)
            return input.editReply(
                userId === input.user.id
                    ? "You don't have a profile yet, one will be created for you when you play your first game."
                    : "That user doesn't have a profile yet."
            );

        const [meta, games] = await Games.getGames({ limit: 9 }, user);
        const embed = Browser.buildGamesEmbed(games, meta.total) //
            .setTitle(`Games Created by ${user.displayName}`);
        const buttons = Common.buildComponentRow(
            ...Browser.buildGameBrowserButtons(
                { limit: 9 },
                user.id,
                false,
                meta.total > 9
            )
        );

        return input.editReply({ embeds: [embed], components: [buttons] });
    }
}
