import { ApplicationCommandOptionType } from 'discord.js';
import _ from 'lodash';
import { Command } from 'maclary';
import * as Profile from '#/builders/profile';
import { UserHandler } from '#/handlers/UserHandler';

export class ProfileCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'profile',
            description: 'Get the Qwaroo profile of a user.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],

            options: [
                {
                    name: 'user',
                    description: 'The user to get the profile of.',
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await input.deferReply();

        const userId = input.options.getUser('user')?.id ?? input.user.id;
        const user = await UserHandler.getUserFromAccountId(userId);

        const msg = "User doesn't have a profile yet.";
        if (!user) return input.editReply(msg);

        const profile = Profile.buildProfile(user);
        const scores = await Profile.fetchAndBuildScores(user, { limit: 3 });
        const games = await Profile.fetchAndBuildGames(user, { limit: 3 });
        const buttons = Profile.buildButtons(user);

        return input.editReply({
            embeds: _.compact([profile, scores, games]),
            components: [buttons],
        });
    }
}
