import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} from '@discordjs/builders';
import { Games, getEnv } from '@qwaroo/server';
import type { FetchGamesOptions } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import { ButtonStyle, ComponentType } from 'discord.js';
import type { Action } from 'maclary';
import { Command } from 'maclary';
import { formatGame } from '#/utilities/formatters';

export class GamesCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'games',
            description: 'Get a list of games you can play.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await input.deferReply();

        const options = this._buildOptions({});
        const payload = await this._fetchAndBuildGames(options);
        const response = await input.editReply(payload);

        const settings = { componentType: ComponentType.Button } as const;
        const collector = response.createMessageComponentCollector(settings);
        collector.on('collect', button => this._onButton(button, options));
    }

    private async _onButton(
        button: Action.Button,
        baseOptions: FetchGamesOptions
    ) {
        const [, direction] = button.customId.split(',');
        const options = this._buildOptions(
            baseOptions,
            direction === 'next' ? 1 : -1
        );

        const payload = await this._fetchAndBuildGames(options);
        await button.update(payload);
    }

    private async _fetchAndBuildGames(options: FetchGamesOptions) {
        const [meta, games] = await Games.getGames(options);

        const skip = meta.skip ?? 0;
        const limit = meta.limit ?? 9;
        const page = Math.floor(skip / limit) + 1;
        const first = (page - 1) * limit + 1;
        const last = Math.min(page * limit, meta.total);

        const url = new URL(
            WebRoutes.games(),
            getEnv(String, 'WEB_URL')
        ).toString();

        const mainEmbed = new EmbedBuilder()
            .setTitle('Games')
            .setURL(url)
            .setFields(
                games.map(game => ({
                    name: game.title,
                    value: formatGame(game),
                    inline: true,
                }))
            )
            .setFooter({
                text: `Showing ${first}-${last} of ${meta.total} games.`,
            })
            .setColor(0x3884f8);

        const backButton = new ButtonBuilder()
            .setCustomId('.,back')
            .setLabel('Back')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(skip === 0);

        const nextButton = new ButtonBuilder()
            .setCustomId('.,next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(skip + games.length >= meta.total);

        const buttonRow = new ActionRowBuilder<ButtonBuilder>();
        buttonRow.addComponents([backButton, nextButton]);

        return { embeds: [mainEmbed], components: [buttonRow] };
    }

    private _buildOptions(
        baseOptions: FetchGamesOptions,
        increasePage: number = 0
    ) {
        return {
            ...baseOptions,
            skip:
                (baseOptions.skip ?? 0) +
                (baseOptions.limit ?? 9) * increasePage,
            limit: 9,
        } as const;
    }
}
