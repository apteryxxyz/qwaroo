/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-eval */
import { inspect } from 'node:util';
import { EmbedBuilder, codeBlock } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord.js';
import { Command, Preconditions } from 'maclary';

export default class EvalCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Prefix]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Prefix],
            name: 'eval',
            description:
                'Evaluate JavaScript code in the context of this command.',
            preconditions: [
                Preconditions.BotOwnerOnly,
                Preconditions.ClientPermissions([
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.SendMessages,
                ]),
            ],
            options: [
                {
                    type: Command.OptionType.String,
                    name: 'script',
                    description: 'The JavaScript code to evaluate.',
                    required: true,
                },
            ],
        });
    }

    public override async onPrefix(message: Command.Message) {
        const script = message.cleanContent.split('eval')[1];
        if (!script) return void message.reply('No script was provided.');

        let colour = 0x2fc086;
        let output: any = '';
        const hasAwait = script.match(/await /g);
        const hasReturn = script.match(/return /g);
        const hasResolve = script.match(/(!<?\.)resolve\(/g);

        if (hasAwait && !hasReturn && !hasResolve)
            return message.reply(
                'Script has await but is missing a way to return.'
            );

        // @ts-expect-error Easy access to container
        const container = this.container;

        try {
            if (!hasAwait && !hasResolve) {
                output = eval(script);
            } else if (hasReturn) {
                output = eval(`(async()=>{${script}})()`);
            } else if (hasResolve) {
                // @ts-expect-error Allow use of resolve and reject in eval
                output = new Promise((resolve, reject) =>
                    eval(`(async()=>{${script}})();`)
                );
            }

            if (output instanceof Promise) {
                output = await Promise.resolve(output);
            }

            if (typeof output !== 'string') {
                output = inspect(output);
            }
        } catch (error) {
            output = error;
        }

        if (output instanceof Error) {
            const stack = output.stack?.toString().split('\n') ?? [
                output.message,
            ];
            output = stack.slice(0, 5).join('\n');
            colour = 0xff0000;
        }

        const embed = new EmbedBuilder()
            .setTitle('Evaluation Result')
            .setColor(colour)
            .setTimestamp()
            .addFields([
                {
                    name: 'Input',
                    value: codeBlock(script.slice(0, 1_000)),
                },
                {
                    name: 'Output',
                    value: codeBlock(output.slice(0, 1_000)),
                },
            ]);

        return message.reply({ embeds: [embed] });
    }
}
