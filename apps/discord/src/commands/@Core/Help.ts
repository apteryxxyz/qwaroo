/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { Command } from 'maclary';
import { buildCommands, getSubCommands } from '#/builders/help';

export class HelpCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'help',
            description: 'View a list of commands.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const commands = this._buildCommands();
        return input.reply({ embeds: [commands] });
    }

    private _buildCommands() {
        const { maclary } = this.container;
        const commands = Array.from(maclary.commands.cache.values());
        const commandObjects = commands.flatMap(cmd => getSubCommands(cmd));
        return buildCommands(commandObjects);
    }
}
