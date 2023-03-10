import { Command } from 'maclary';
import * as Common from '#/builders/common';
import * as Help from '#/builders/help';

export class HelpCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'help',
            description: 'View a list of commands and useful links.',
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const commands = Help.buildCommandsEmbed();
        const policies = Common.buildComponentRow(...Help.buildPolicyButtons());
        const general = Common.buildComponentRow(
            ...(await Help.buildGeneralButtons())
        );

        return input.reply({
            embeds: [commands],
            components: [general, policies],
        });
    }
}
