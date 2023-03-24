import { Games, Scores, Users } from '@qwaroo/server';
import { Action } from 'maclary';
import * as Browser from '#/builders/browser';
import * as Common from '#/builders/common';
import * as Profile from '#/builders/profile';

export class UserAction extends Action {
    public constructor() {
        super({ id: 'user' });
    }

    public override async onButton(button: Action.Button) {
        const [, id, action] = button.customId.split(',');

        await button.deferReply({ ephemeral: true });
        const user = await Users.getUser(id).catch(() => null);
        if (!user) return button.editReply("I couldn't find that user.");

        if (action === 'profile') {
            const embed = Profile.buildProfile(user);
            const buttons = Common.buildComponentRow(
                ...Profile.buildButtons(user)
            );

            return button.editReply({ embeds: [embed], components: [buttons] });
        }

        if (action === 'games') {
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

            return button.editReply({ embeds: [embed], components: [buttons] });
        }

        if (action === 'scores') {
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

            return button.editReply({ embeds: [embed], components: [buttons] });
        }

        return button.reply("I don't know what you want me to do.");
    }
}
