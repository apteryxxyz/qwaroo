import ytch, { Video } from 'yt-channel-info';
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
                throw new Error(
                    `No YouTube channel ID was provided for channel #${
                        index + 1
                    }.`
                );

            const channel = await ytch
                .getChannelInfo({ channelId })
                .catch(() => null);

            if (!channel || channel.alertMessage)
                throw new Error(
                    `No YouTube channel was found for "${channelId}".`
                );

            channels.push(channel);
        }

        return `Your game will feature videos from ${channels
            .map(channel => channel.author)
            .join(', ')}.`;
    }

    public async fetchItems(options: Options) {
        const channelIds = [
            options.channelId,
            options.secondChannelId,
            options.thirdChannelId,
        ].filter(Boolean) as string[];

        const allVideos: Video[] = [];

        for (const channelId of channelIds) {
            const channelVideos = await this._getChannelVideos(channelId);
            allVideos.push(...channelVideos);
        }

        if (allVideos.length < 100)
            throw new Error(
                `Only ${allVideos.length} videos were found across all channels, but at least 100 are required.`
            );

        return allVideos.map(video => ({
            display: video.title,
            value: video.viewCount,
            imageUrl: this._makeMaxResolution(video.videoThumbnails![0].url),
            imageFrame: 'fill' as const,
        }));
    }

    private async _getChannelVideos(channelId: string) {
        const channelVideos = [];
        let continuation: string = null!;

        while (channelVideos.length < 200) {
            const getMethod = continuation
                ? 'getChannelVideosMore'
                : 'getChannelVideos';
            const latestVideos = await ytch[getMethod]({
                continuation,
                channelId,
            });

            const filteredVideos = latestVideos.items.filter(
                video =>
                    !video.liveNow &&
                    // Shorts are too easy to guess
                    video.lengthSeconds > 60 &&
                    video.videoThumbnails
            );
            channelVideos.push(...filteredVideos);

            if (!latestVideos.continuation) break;
            continuation = latestVideos.continuation;
        }

        return channelVideos;
    }

    private _makeMaxResolution(thumbnailUrl: string) {
        const url = new URL(thumbnailUrl);
        const path = url.pathname.split('/');
        path.splice(-1, 1, 'maxresdefault.jpg');
        url.pathname = path.join('/');
        return url.toString().split('?')[0];
    }
}
