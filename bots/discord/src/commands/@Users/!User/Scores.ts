import { Games, Scores } from '@qwaroo/server';
import { Command } from 'maclary';
import * as Browser from '#/builders/browser';
import * as Common from '#/builders/common';
import { UserHandler } from '#/classes/UserHandler';

export class UserScoresCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'scores',
            description: 'View the game scores of a user, or yourself.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],

            options: [
                {
                    name: 'user',
                    description: 'The user to view the scores of.',
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

        const [meta, scores] = await Scores.getScores(user, { limit: 9 });
        const gameIds = scores.map(score => score.gameId);
        const [, games] = await Games.getGames({ ids: gameIds });

        const params = [scores, games, meta.total] as const;
        const embed = Browser.buildUserScoresEmbed(...params) //
            .setTitle(`Game Scores for ${user.displayName}`);
        const buttons = Common.buildComponentRow(
            ...Browser.buildUserScoresBrowserButtons(
                { limit: 9 },
                user.id,
                false,
                meta.total > 9
            )
        );

        return input.editReply({ embeds: [embed], components: [buttons] });
    }
}
