/* eslint-disable @typescript-eslint/no-explicit-any */
import { URL } from 'node:url';
import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { getEnv } from '@qwaroo/server';
import { WebRoutes } from '@qwaroo/types';
import { OAuth2Scopes } from 'discord-api-types/v10';
import { ButtonStyle, PermissionsBitField } from 'discord.js';
import { Command, container } from 'maclary';

// Commands

export function buildCommandsEmbed(
    commands: Command<any, any>[] = Array.from(container.maclary.commands.cache)
) {
    const categories = new Map<string, ReturnType<typeof parseSubCommand>[]>();
    for (const group of commands)
        for (const command of getSubCommands(group)) {
            if (command.category === 'Developer') continue;
            const category = categories.get(command.category);
            if (category) category.push(command);
            else categories.set(command.category, [command]);
        }

    return new EmbedBuilder()
        .setTitle('Commands')
        .setFields(
            [...categories.entries()].map(([category, commands]) => ({
                name: category,
                value: formatCommands(commands),
            }))
        )
        .setColor(0x3884f8);
}

function formatCommands(commands: ReturnType<typeof parseSubCommand>[]) {
    const usages = commands.map(command => command.usage);
    const descriptions = commands.map(command => command.description);
    const maxLength = Math.max(...usages.map(usage => usage.length));

    return usages
        .map(
            (usage, i) => `\`${usage.padEnd(maxLength)}\` - ${descriptions[i]}`
        )
        .join('\n');
}

function resolvePrefix(command: Command<any, any>) {
    const hasUser = command.kinds.includes(Command.Kind.User);
    const hasMessage = command.kinds.includes(Command.Kind.Message);
    const hasSlash = command.kinds.includes(Command.Kind.Slash);

    if (hasUser && hasMessage) return 'App > ';
    else if (hasUser) return 'Usr > ';
    else if (hasMessage) return 'Msg > ';
    else if (hasSlash) return '/';
    return '!';
}

function getSubCommands(
    command: Command<any, any>,
    name: string = ''
): ReturnType<typeof parseSubCommand>[] {
    if (Reflect.get(command, '_variety') === 2)
        return [parseSubCommand(command, name)];
    else if (Reflect.get(command, '_variety') === 1)
        return (command.options as Command<any, any>[]) //
            .flatMap(cmd => getSubCommands(cmd, `${name + command.name} `));
    return [];
}

function parseSubCommand(command: Command<any, any>, name: string = '') {
    return {
        category: (command.category as string | '') || 'Uncategorised',
        usage: `${resolvePrefix(command)}${name + command.name}`,
        options: (command.options as { required: boolean; name: string }[]) //
            .map(opt =>
                opt.required
                    ? (`<${opt.name}>` as const)
                    : (`[${opt.name}]` as const)
            ),
        description: command.description,
    };
}

// Links

export function buildGeneralButtons() {
    return [
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(getEnv(String, 'WEB_URL'))
            .setLabel('Qwaroo'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(getBotInvite())
            .setLabel('Invite'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(getSupportInvite())
            .setLabel('Support'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(
                new URL(
                    WebRoutes.donate(),
                    getEnv(String, 'WEB_URL')
                ).toString()
            )
            .setLabel('Donate'),
    ];
}

export function buildPolicyButtons() {
    return [
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(getEnv(String, 'WEB_URL') + WebRoutes.privacyPolicy())
            .setLabel('Privacy Policy'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(getEnv(String, 'WEB_URL') + WebRoutes.termsOfUse())
            .setLabel('Terms of Use'),
    ];
}

function getBotInvite() {
    const addParams = container.client.application.installParams ?? {
        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
        permissions: new PermissionsBitField(
            PermissionsBitField.Flags.Administrator
        ),
    };
    return container.client.generateInvite(addParams);
}

function getSupportInvite() {
    return 'https://discord.gg/vZQbMhwsKY';
}
