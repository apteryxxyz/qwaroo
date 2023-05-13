import { Command } from 'maclary';

export class CreateCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'create',
            description: 'Create your own custom game of Higher or Lower.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        return input.reply(
            'Wanting to create your own custom game of Higher or Lower? Head over to https://qwaroo.com/games/create to get started!'
        );
    }
}
