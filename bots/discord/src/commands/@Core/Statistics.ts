import { EmbedBuilder } from '@discordjs/builders';
import { Statistics } from '@qwaroo/server';
import { ms } from 'enhanced-ms';
import { Command } from 'maclary';

export default class StatisticsCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'statistics',
            description: 'Shows some statistics about Qwaroo and the bot.',
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const client = input.client;

        const formattedUptime =
            ms(client.uptime, { shortFormat: true }) ?? '0s';
        const guildCount = client.guilds.cache.size;
        const userCount = client.guilds.cache //
            .reduce((total, guild) => total + guild.memberCount, 0);

        const statistics = await Statistics.getGameStatistics();
        const timePlayed =
            ms(statistics.totalTime, {
                shortFormat: true,
            }) ?? '0s';

        const embed = new EmbedBuilder()
            .setTitle('Qwaroo Statistics')
            .addFields([
                fieldBuilder('Games Played', statistics.totalPlays),
                fieldBuilder('Points Scored', statistics.totalScore),
                fieldBuilder('Time Played', timePlayed),

                fieldBuilder('Bot Uptime', formattedUptime),
                fieldBuilder('Server Count', guildCount),
                fieldBuilder('User Count', userCount),
            ])
            .setColor(0x3884f8);

        return input.reply({
            embeds: [embed],
        });
    }
}

function fieldBuilder(name: string, value: unknown) {
    return {
        name,
        value: String(value).trim().replaceAll(/\s+/g, ' '),
        inline: true,
    };
}
