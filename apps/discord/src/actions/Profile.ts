import { Users } from '@qwaroo/server';
import _ from 'lodash';
import { Action } from 'maclary';
import * as Profile from '#/builders/Profile';

export class ProfileAction extends Action {
    public constructor() {
        super({ id: 'profile' });
    }

    public override async onButton(button: Action.Button) {
        await button.deferReply();

        const [, id] = button.customId.split(',');
        const user = await Users.getUser(id).catch(() => null);

        const msg = "User doesn't have a profile yet.";
        if (!user) return button.editReply(msg);

        const payload = Profile.buildProfile(user);
        const scores = await Profile.fetchAndBuildScores(user, { limit: 3 });
        const games = await Profile.fetchAndBuildGames(user, { limit: 3 });
        const buttons = Profile.buildButtons(user);

        return button.editReply(
            _.mergeWith(payload, scores, games, buttons, (a, b) =>
                _.isArray(a) ? a.concat(b) : a
            )
        );
    }
}
