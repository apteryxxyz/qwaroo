import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} from '@discordjs/builders';
import { Games, Scores, getEnv } from '@qwaroo/server';
import { WebRoutes } from '@qwaroo/types';
import { ApplicationCommandOptionType, ButtonStyle } from 'discord.js';
import ms from 'enhanced-ms';
import { Command } from 'maclary';
import { Handler } from '#/structures/Handler';
import { buildGamesEmbed, buildScoresEmbed } from '#/utilities/builders';

export class ProfileCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            name: 'profile',
            description: 'Get the Qwaroo profile of a user.',
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],

            options: [
                {
                    name: 'user',
                    description: 'The user to get the profile of.',
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await input.deferReply();

        const userId = input.options.getUser('user')?.id ?? input.user.id;
        const user = await Handler.getUserFromAccountId(userId);

        const msg = "User doesn't have a profile yet.";
        if (!user) return input.editReply(msg);

        const embeds = [];
        const components = [];

        const profileUrl = new URL(
            WebRoutes.user(user.id),
            getEnv(String, 'WEB_URL')
        ).toString();

        embeds.push(
            new EmbedBuilder()
                .setTitle(`${user.displayName}'s Profile`)
                .setDescription(formatJoinDate(user.joinedTimestamp))
                .setURL(profileUrl)
                .setThumbnail(user.avatarUrl)
                .setColor(0x3884f8)
        );

        const [scoresMeta, scores] = await Scores.getScores(user, { limit: 6 });
        if (scoresMeta.total > 0) {
            const gameIds = scores.map(score => score.gameId);
            const [, games] = await Games.getGames({ ids: gameIds });

            const embed = buildScoresEmbed(
                scores,
                scoresMeta.total,
                games,
                user
            ).setTitle('Highest Scores');
            embeds.push(embed);
        }

        const [gamesMeta, games] = await Games.getGames({ limit: 3 }, user);
        if (gamesMeta.total > 0) {
            const embed = buildGamesEmbed(games, gamesMeta.total) //
                .setTitle('Top Games');
            embeds.push(embed);
        }

        const profileButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('View Full Profile')
            .setURL(profileUrl);
        const buttonRow = new ActionRowBuilder<ButtonBuilder>() //
            .addComponents(profileButton);
        components.push(buttonRow);

        return input.editReply({ embeds, components });
    }
}

function formatJoinDate(joinedTimestamp: number) {
    const atString = new Date(joinedTimestamp).toLocaleDateString('en-NZ');
    const timeAgo = ms(Date.now() - joinedTimestamp, { roundUp: true });
    return `Joined ${atString}, about ${timeAgo} ago.`;
}
