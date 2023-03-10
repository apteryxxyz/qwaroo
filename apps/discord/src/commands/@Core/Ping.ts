import { User } from '@qwaroo/server';
import { Command } from 'maclary';

export default class PingCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'ping',
            description: 'Pong! Shows the latency and ping for the bot.',
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const reply = await input.reply({
            content: 'Pinging client...',
            fetchReply: true,
        });
        const botLatency = reply.createdTimestamp - input.createdTimestamp;

        const wsPing = input.client.ws.ping;
        const dbStart = Date.now();
        await User.Model.findOne({});
        const dbLatency = Date.now() - dbStart;

        await input.editReply(
            `🏓 **Ping**: ${wsPing}ms,` +
                ` **Latency**: ${botLatency}ms,` +
                ` **Database**: ${dbLatency}ms`
        );
    }
}
