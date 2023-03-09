/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmbedBuilder } from '@discordjs/builders';
import { Command } from 'maclary';

export function resolvePrefix(command: Command<any, any>) {
    const hasUser = command.kinds.includes(Command.Kind.User);
    const hasMessage = command.kinds.includes(Command.Kind.Message);
    const hasSlash = command.kinds.includes(Command.Kind.Slash);

    if (hasUser && hasMessage) return 'Apps > ';
    else if (hasUser) return 'User > ';
    else if (hasMessage) return 'Message > ';
    else if (hasSlash) return '/';
    return '!';
}

export function getSubCommands(
    command: Command<any, any>,
    name: string = ''
): ReturnType<typeof parseSubCommand>[] {
    if (Reflect.get(command, '_variety') === 2)
        return [parseSubCommand(command, name)];
    else if (Reflect.get(command, '_variety') === 1)
        return (command.options as Command<any, any>[]) //
            .flatMap(cmd => getSubCommands(cmd, name));
    return [];
}

export function parseSubCommand(command: Command<any, any>, name: string = '') {
    return {
        prefix: resolvePrefix(command),
        name: `${name}${command.name}`.trim(),
        description: command.description,
        category: (command.category as string | '') || 'Uncategorised',
        options: (command.options as { required: boolean; name: string }[]) //
            .map(opt => (opt.required ? `<${opt.name}>` : `[${opt.name}]`)),
    } as const;
}

export function buildCommands(
    commands: ReturnType<typeof parseSubCommand>[] = []
) {
    const categories = new Map<string, ReturnType<typeof parseSubCommand>[]>();
    for (const command of commands.flat()) {
        if (command.category === 'Developer') continue;
        const category = categories.get(command.category);
        if (category) category.push(command);
        else categories.set(command.category, [command]);
    }

    return new EmbedBuilder()
        .setTitle('Commands')
        .setFields(
            [...categories.entries()]
                .sort((a, b) => b[1].length - a[1].length)
                .map(([category, commands]) => ({
                    name: category,
                    value: formatCommands(commands),
                }))
        )
        .setColor(0x3884f8);
}

export function formatCommands(commands: ReturnType<typeof parseSubCommand>[]) {
    const usages = commands.map(formatUsage);
    const descriptions = commands.map(command => command.description);
    const maxLength = Math.max(...usages.map(usage => usage.length));

    return usages
        .map((usage, i) => {
            const padding = ' '.repeat(maxLength - usage.length);
            return `\`${usage}${padding}\` - ${descriptions[i]}`;
        })
        .join('\n');
}

export function formatUsage(command: ReturnType<typeof parseSubCommand>) {
    return `${command.prefix}${command.name} ${command.options.join(
        ' '
    )}`.trim();
}
