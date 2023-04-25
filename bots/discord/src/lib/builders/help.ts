/* eslint-disable @typescript-eslint/no-explicit-any */
import { URL } from 'node:url';
import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { getEnv } from '@qwaroo/server';
import { WebRoutes } from '@qwaroo/types';
import { OAuth2Scopes } from 'discord-api-types/v10';
import type { ApplicationCommand } from 'discord.js';
import { ButtonStyle, PermissionsBitField } from 'discord.js';
import type { Command } from 'maclary';
import { container } from 'maclary';

// Commands

export function buildCommandsEmbed(
    internalCommands: Command<any, any>[],
    externalCommands: ApplicationCommand[]
) {
    const categories = new Map<string, string[]>();
    for (const command of externalCommands) {
        const category =
            internalCommands.find(cmd => cmd.name === command.name)?.category ??
            'Misc';
        if (category === 'Developer') continue;

        const commands = categories.get(category) ?? [];
        commands.push(...parseCommand(command, command.id));
        categories.set(category, commands);
    }

    return new EmbedBuilder()
        .setTitle('Commands')
        .setFields(
            [...categories.entries()].map(([category, commands]) => ({
                name: category,
                value: commands.join('\n'),
            }))
        )
        .setColor(0x3884f8);
}

interface HelpCommand {
    type: number;
    name: string;
    description: string;
    options?: HelpCommand[];
}
function parseCommand(command: HelpCommand, id: string, prefix = ''): string[] {
    if (
        command.options?.length &&
        command.options?.every(opt => opt.type === 1)
    )
        return command.options.flatMap(opt =>
            parseCommand(opt, id, `${prefix}${command.name} `)
        );
    return [`</${prefix}${command.name}:${id}> ${command.description}`];
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
