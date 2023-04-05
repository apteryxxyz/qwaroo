import { Game } from '@qwaroo/types';
import ytpl from 'ytpl';
import { Source } from '#/structures/Source';

export class YouTubeChannelVideoViews extends Source<
    Game.Mode.HigherOrLower,
    keyof YouTubeChannelVideoViews.Properties
> {
    public override readonly slug = 'youtube-channel-video-views';

    public constructor() {
        super({
            mode: Game.Mode.HigherOrLower,
            name: 'YouTube Channel Video Views',
            description: '',
            isPublic: true,

            properties: {
                channelIds: {
                    type: [Source.Prop.Type.String],
                    name: 'Channel IDs',
                    description:
                        'The IDs of the YouTube channels to fetch videos from.',
                    required: true,
                },

                maxVideoCount: {
                    type: Source.Prop.Type.Number,
                    name: 'Maximum Video Count',
                    description:
                        'The max number of videos (per channel) to use.',
                    required: true,
                    default: 250,
                },

                minViewCount: {
                    type: Source.Prop.Type.Number,
                    name: 'Minimum View Count',
                    description:
                        'The minimum number of views a video must have.',
                    required: true,
                    default: 1,
                },
            },
        });
    }

    public async fetchItems(properties: YouTubeChannelVideoViews.Properties) {
        const items: Game.Item<Game.Mode.HigherOrLower>[] = [];

        for (const channelId of properties.channelIds) {
            const channelName = await this._getChannelName(channelId);
            const videos = await this._getChannelVideos(
                channelId,
                channelName,
                properties
            );

            items.push(...videos);
        }

        return items;
    }

    public toArray() {
        return [this.slug, this] as const;
    }

    private async _getChannelName(channelId: string) {
        const result = await ytpl(channelId, { limit: 1 });
        return result.author.name;
    }

    private async _getChannelVideos(
        channelId: string,
        channelName: string,
        properties: YouTubeChannelVideoViews.Properties
    ) {
        const { items: allVideos } = await ytpl(channelId, {
            limit: properties.maxVideoCount,
        });

        const filteredVideos = allVideos.filter(
            video =>
                (video.views ?? 0) >= properties.minViewCount &&
                // Shorts are too easy to guess
                (video.durationSec ?? 0) > 60
        );

        return filteredVideos.map(video => ({
            display: video.title,
            value: video.views ?? 0,
            imageSource: video.bestThumbnail.url
                ?.replace('hqdefault', 'maxresdefault')
                .split('?')[0] as string,
            imageFrame: 'fill' as const,
            caption: `on ${channelName}, as of ${new Date().toLocaleDateString()}`,
        }));
    }
}

export namespace YouTubeChannelVideoViews {
    export interface Properties {
        channelIds: string[];
        maxVideoCount: number;
        minViewCount: number;
    }
}
