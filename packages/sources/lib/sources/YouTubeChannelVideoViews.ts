import { Game } from '@qwaroo/types';
import ytpl from 'ytpl';
import { useLogger } from '#/Logger';
import { Source } from '#/Source';
import { prepareOptions } from '#/validators/prepareOptions';

// TYPES

export interface Options {
    channelIds: string[];
    maxVideoCount: number;
    minViewCount: number;
}

// META

export const source: Source<keyof Options, Options, Game.Mode.HigherOrLower> = {
    for: Game.Mode.HigherOrLower,
    ...Source.meta('YouTube Channel Video Views', ''),

    props: {
        channelIds: {
            type: [Source.Prop.Type.String],
            name: 'Channel IDs',
            description: 'The ID(s) of the channel(s) to add to this game.',
            required: true,
        },

        maxVideoCount: {
            type: Source.Prop.Type.Number,
            name: 'Maximum  Video Count',
            description: 'The max number of videos (per channel) to use.',
            required: true,
            default: 250,
        },

        minViewCount: {
            type: Source.Prop.Type.Number,
            name: 'Minimum View Count',
            description: 'The minimum number of views a video must have.',
            required: true,
            default: 1,
        },
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems(options, verbose = false) {
        const instanceId = Math.random().toString(36).slice(2);
        const logger = useLogger(`${this.slug}(${instanceId})`);
        if (verbose) logger.info(`Fetching videos...`);

        const items: Game.Item<Game.Mode.HigherOrLower>[] = [];

        for (const channelId of options.channelIds) {
            const channelName = await _getChannelName(channelId);

            const opts = [channelId, channelName, options] as const;
            const videos = await _getChannelVideos(...opts);

            if (!videos) {
                if (verbose)
                    logger.warn(
                        `Failed to fetch videos for "${channelName}", skipping`
                    );
                continue;
            }

            items.push(...videos);
            if (verbose)
                logger.info(
                    `Added channel "${channelName}" (${videos.length} videos)`
                );
        }

        if (verbose) logger.info(`Finished fetching ${items.length} videos`);
        return items;
    },
};

// UTILS

async function _getChannelName(channelId: string) {
    const result = await ytpl(channelId, { limit: 1 });
    return result.author.name;
}

async function _getChannelVideos(id: string, name: string, options: Options) {
    const { items: allVideos } = await ytpl(id, {
        limit: options.maxVideoCount,
    });

    const filteredVideos = allVideos.filter(
        video =>
            (video.views ?? 0) >= options.minViewCount &&
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
        caption: `on ${name}, as of ${new Date().toLocaleDateString()}`,
    }));
}
