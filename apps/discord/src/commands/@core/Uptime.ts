import { ms } from 'enhanced-ms';
import { Command } from 'maclary';

export default class PingCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'uptime',
            description: 'Shows how long the bot has been online for.',
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const uptime = input.client.uptime;
        const formattedUptime = ms(uptime, { shortFormat: true });
        await input.reply(`🤖 **Uptime**: ${formattedUptime}`);
    }
}
