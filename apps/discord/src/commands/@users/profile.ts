import { Handler } from '#/lib/structures/Handler';
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} from '@discordjs/builders';
import { Games, getEnv, Score, Scores } from '@qwaroo/server';
import { WebRoutes } from '@qwaroo/types';
import { ApplicationCommandOptionType, ButtonStyle } from 'discord.js';
import { Command } from 'maclary';
import ms from 'enhanced-ms';

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

        const [_1, scores] = await Scores.getScores(user, { limit: 3 });
        const scoreGameIds = scores.map(s => s.gameId);
        const [_2, scoreGames] = await Games.getGames({
            ids: scoreGameIds,
            limit: 3,
        });

        const profileUrl = new URL(
            WebRoutes.user(user.id),
            getEnv(String, 'WEB_URL')
        ).toString();

        const profileEmbed = new EmbedBuilder()
            .setThumbnail(user.avatarUrl)
            .setTitle(user.displayName)
            .setDescription(formatJoinDate(user.joinedTimestamp))
            .setURL(profileUrl)
            .setColor(0x3884f8);

        const scoresEmbed = new EmbedBuilder()
            .setTitle('Highest Scores')
            .setFields(
                scores.map((s, i) => ({
                    name: scoreGames[i]?.title ?? 'Unknown Game',
                    value: formatScore(s, s.id === user.id),
                    inline: true,
                }))
            )
            .setColor(0x3884f8);

        const profileButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('View Full Profile')
            .setURL(profileUrl);
        const buttonRow = new ActionRowBuilder<ButtonBuilder>() //
            .addComponents(profileButton);

        return input.editReply({
            embeds: [profileEmbed, scoresEmbed],
            components: [buttonRow],
        });
    }
}

function formatJoinDate(joinedTimestamp: number) {
    const atString = new Date(joinedTimestamp).toLocaleDateString('en-NZ');
    const timeAgo = ms(Date.now() - joinedTimestamp, { roundUp: true });
    return `Joined ${atString}, about ${timeAgo} ago.`;
}

function formatScore(score: Score.Document, isMe: boolean) {
    return `**Highscore of ${score.highScore}**\n${
        isMe ? 'You' : 'They'
    } played ${score.totalPlays} time${
        score.totalPlays === 1 ? '' : 's'
    } over ${ms(score.totalTime, { shortFormat: true })}, ${
        isMe ? 'your' : 'their'
    } total score is ${score.totalScore}.`;
}
