import { Game } from '@owenii/types';
import ytpl from 'ytpl';
import { Source } from '#/Source';
import { prepareOptions } from '#/validators/prepareOptions';

export interface Options {
    channelIds: string[];
    videoCount: number;
    minimumViews: number;
}

export const source: Source<keyof Options, Options, Game.Type.HigherOrLower> = {
    for: Game.Type.HigherOrLower,
    slug: 'hol.yt-channel',
    name: 'YouTube Channel',
    description:
        'Get a list of videos from a YouTube channel.\n' +
        `This will fetch the latest videos from one or more channels, and
        then filter them based on the minimum views. The video title will
        be used for the display name, the thumbnail will be used as the
        image and the view count will be used for the value.
        `.replaceAll(/\s+/g, ' '),

    props: {
        channelIds: {
            type: [Source.Prop.Type.String],
            description: 'The IDs of the YouTube channels.',
            required: true,
        },

        videoCount: {
            type: Source.Prop.Type.Number,
            description: 'The number of videos to fetch.',
            required: false,
            default: 200,
        },

        minimumViews: {
            type: Source.Prop.Type.Number,
            description: 'The minimum number of views a video must have.',
            required: false,
            default: 0,
        },
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems(partialOptions) {
        const options = prepareOptions<Options>(this.props, partialOptions);
        const items: Game.Item<Game.Type.HigherOrLower>[] = [];

        for (const channelId of options.channelIds) {
            const channel = await _getChannelInfo(channelId);
            const videos = await _getChannelVideos(channel, options);
            items.push(...videos);
        }

        return items;
    },
};

async function _getChannelInfo(channelId: string) {
    const result = await ytpl(channelId, { limit: 1 });
    return {
        id: result.author.channelID,
        name: result.author.name,
    };
}

async function _getChannelVideos(
    channel: Awaited<ReturnType<typeof _getChannelInfo>>,
    options: Options
): Promise<Game.Item<Game.Type.HigherOrLower>[]> {
    const result = await ytpl(channel.id, { limit: options.videoCount });

    return result.items
        .filter(item => (item.views ?? 0) >= options.minimumViews)
        .map(item => ({
            display: item.title,
            value: item.views ?? 0,
            imageSource: (item.durationSec ?? 0 > 60
                ? item.bestThumbnail.url?.replace('hqdefault', 'maxresdefault')
                : item.bestThumbnail.url) as string,
            imageFrame: ((item.durationSec ?? 0) > 60 ? 'fill' : 'fit') as
                | 'fill'
                | 'fit',
            caption:
                options.channelIds.length > 1
                    ? `On ${channel.name}`
                    : undefined,
        }));
}
