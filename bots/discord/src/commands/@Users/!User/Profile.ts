import { Command } from 'maclary';
import * as Common from '#/builders/common';
import * as Profile from '#/builders/profile';
import { UserHandler } from '#/classes/UserHandler';

export class ProfileCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'profile',
            description: 'View the profile of a user, or yourself.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],

            options: [
                {
                    name: 'user',
                    description: 'The user to view the profile of.',
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

        const embed = Profile.buildProfile(user);
        const buttons = Common.buildComponentRow(...Profile.buildButtons(user));

        return input.editReply({ embeds: [embed], components: [buttons] });
    }
}
