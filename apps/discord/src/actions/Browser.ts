import type { User } from '@qwaroo/server';
import { Games, Scores, Users } from '@qwaroo/server';
import type { FetchGamesOptions, FetchScoresOptions } from '@qwaroo/types';
import { Action } from 'maclary';
import * as Browser from '#/builders/browser';
import * as Common from '#/builders/common';

export class BrowserAction extends Action {
    public constructor() {
        super({ id: 'browser' });
    }

    public override async onButton(button: Action.Button) {
        if (button.user.id !== button.message.interaction?.user.id)
            return button.reply({
                content: "You can't use this button.",
                ephemeral: true,
            });

        const [, browser, childId, rawOptions, action] =
            button.customId.split(',');
        const baseOptions = Browser.decodeOptions(rawOptions);

        if (browser === 'games') {
            const newOptions = Browser.createPageOptions(
                baseOptions,
                action === 'start' ? 0 : action === 'back' ? -1 : 1
            ) as FetchGamesOptions;

            await button[action === 'start' ? 'deferReply' : 'deferUpdate']({
                ephemeral: true,
            });
            const user = childId
                ? await Users.getUser(childId).catch(() => undefined)
                : undefined;
            const [meta, games] = await Games.getGames(newOptions, user);

            const params = [games, meta.total, meta.skip, meta.limit] as const;
            const embed = Browser.buildGamesEmbed(...params);
            if (user) embed.setTitle(`Games Created by ${user.displayName}`);

            const buttons = Common.buildComponentRow(
                ...Browser.buildGameBrowserButtons(
                    { limit: 9 },
                    user?.id,
                    meta.skip !== 0,
                    meta.total > meta.skip + meta.limit
                )
            );

            return button.editReply({
                embeds: [embed],
                components: [buttons],
            });
        }

        if (browser.endsWith('scores')) {
            const newOptions = Browser.createPageOptions(
                baseOptions,
                action === 'start' ? 0 : action === 'back' ? -1 : 1
            ) as FetchScoresOptions;

            await button[action === 'start' ? 'deferReply' : 'deferUpdate']({
                ephemeral: true,
            });
            const child = browser.startsWith('user')
                ? await Users.getUser(childId)
                : await Games.getGame(childId);
            const [meta, scores] = await Scores.getScores(child, newOptions);

            if (browser.startsWith('user')) {
                const gameIds = scores.map(score => score.gameId);
                const [, games] = await Games.getGames({ ids: gameIds });

                const user = child as User.Document;
                const embed = Browser.buildUserScoresEmbed(
                    user,
                    scores,
                    games,
                    meta.total,
                    meta.skip,
                    meta.limit
                ).setTitle(`Games Created by ${user.displayName}`);

                const buttons = Common.buildComponentRow(
                    ...Browser.buildUserScoresBrowserButtons(
                        { limit: 9 },
                        user.id,
                        meta.skip !== 0,
                        meta.total > meta.skip + meta.limit
                    )
                );

                return button.editReply({
                    embeds: [embed],
                    components: [buttons],
                });
            }

            if (browser.startsWith('game')) {
                const userIds = scores.map(score => score.userId);
                const [, users] = await Users.getUsers({ ids: userIds });

                const embed = Browser.buildGameScoresEmbed(
                    scores,
                    users,
                    meta.total,
                    meta.skip,
                    meta.limit
                ).setTitle(`Leaderboard for ${Reflect.get(child, 'title')}`);

                const buttons = Common.buildComponentRow(
                    ...Browser.buildGameScoresBrowserButtons(
                        { limit: 9 },
                        child.id,
                        meta.skip !== 0,
                        meta.total > meta.skip + meta.limit
                    )
                );

                return button.editReply({
                    embeds: [embed],
                    components: [buttons],
                });
            }
        }

        return button.reply("I don't know what you want me to do.");
    }
}
