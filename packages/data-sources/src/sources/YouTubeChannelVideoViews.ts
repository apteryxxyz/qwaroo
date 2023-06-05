import ytch from 'yt-channel-info';
import { Source } from '../structures/Source';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Options = {
    channelId: string;
    secondChannelId?: string;
    thirdChannelId?: string;
};

export class YouTubeChannelVideoViews extends Source<Options> {
    public slug = 'youtube-channel-video-views' as const;
    public name = 'YouTube Channel Video Views';
    public description =
        'Fetch videos from one to three YouTube channels and use their view counts to play a Higher or Lower guessing game.';
    public iconUrl =
        'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png';
    public isPublic = true;

    public properties = {
        channelId: {
            type: Source.PropType.String,
            name: 'Channel Username or ID',
            description: 'Channel whose videos will be used in the game.',
            required: true as const,
        },
        secondChannelId: {
            type: Source.PropType.String,
            name: 'Second Channel Username or ID (Optional)',
            description:
                'Additional channel whose videos will be used in the game, if desired.',
        },
        thirdChannelId: {
            type: Source.PropType.String,
            name: 'Third Channel Username or ID (Optional)',
            description:
                'Additional channel whose videos will be used in the game, if desired.',
        },
    };

    public toJSON() {
        return {
            slug: this.slug,
            name: this.name,
            description: this.description,
            iconUrl: this.iconUrl,
            isPublic: this.isPublic,
            properties: this.properties,
        } satisfies Source.Entity;
    }

    public async validateOptions(options: Partial<Options>) {
        const channelIds = [
            options.channelId,
            options.secondChannelId,
            options.thirdChannelId,
        ];
        const channels = [];

        for (const [index, channelId] of channelIds.entries()) {
            // Only the first channel ID is required
            if (!channelId && index > 0) continue;

            if (!channelId)
                return this._error(
                    `No YouTube channel ID was provided for channel #${
                        index + 1
                    }.`
                );

            const channel = await ytch
                .getChannelInfo({ channelId })
                .catch(() => null);

            if (!channel || channel.alertMessage)
                return this._error(
                    `No YouTube channel was found for "${channelId}".`
                );

            channels.push(channel);
        }

        return this._success(
            `Your game will feature videos from ${channels
                .map(channel => channel.author)
                .join(', ')}.`
        );
    }
}
