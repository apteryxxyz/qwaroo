import { Games } from '@qwaroo/server';
import { Action } from 'maclary';
import { HigherOrLower } from '#/classes/HigherOrLower';
import { UserHandler } from '#/classes/UserHandler';

export class GameAction extends Action {
    public constructor() {
        super({ id: 'game' });
    }

    public override async onButton(button: Action.Button) {
        const [, id, action] = button.customId.split(',');

        await button.deferReply();
        const game = await Games.getGame(id).catch(() => null);
        if (!game)
            return button.editReply("Couldn't find a game with that ID.");

        if (action === 'play') {
            const content = `Preparing **${game.title}**...`;
            const message = await button.editReply(content);

            const user = await UserHandler.findOrCreateUser(button.user);
            const params = [game, user, button.user, message] as const;
            return this.container.games.create(...params);
        }

        return button.editReply("I don't know what you want me to do.");
    }
}

export class PlayAction extends Action {
    public constructor() {
        super({ id: 'play' });
    }

    public override async onButton(button: Action.Button) {
        const [, id, action, ...args] = button.customId.split(',');
        const instance = this.container.games.cache.get(id);

        if (!instance) {
            await button.message.edit({ components: [] });
            return button.reply({
                content: 'This game has expired, start a new one.',
                ephemeral: true,
            });
        }

        if (instance.user.id !== button.user.id)
            return button.reply({
                content:
                    "You can't use this button, start your own game to play.",
                ephemeral: true,
            });

        if (action === 'pick') {
            await button.update({});
            if (instance.status !== HigherOrLower.Status.Waiting) return;

            const decision = args[0] === 'higher' ? 1 : -1;
            return instance.pick(decision);
        }

        if (action === 'end') {
            await button.update({});
            if (instance.status !== HigherOrLower.Status.Waiting) return;

            return instance.end();
        }

        return button.reply("I don't know what you want me to do.");
    }
}
