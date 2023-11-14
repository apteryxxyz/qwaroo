import { Game } from '@qwaroo/shared/types';
import ytch from 'yt-channel-info';
import { Source } from '@/classes/source';

type Video = Awaited<ReturnType<typeof ytch.getChannelVideos>>['items'][0];
interface Properties {
  channelId: string;
  secondChannelId?: string;
  thirdChannelId?: string;
}

export class YouTubeChannelVideoViews extends Source<
  readonly [Game.Mode.HigherOrLower],
  Properties
> {
  public readonly name = 'YouTube Channel Video Views' as const;
  public readonly slug = 'youtube-channel-video-views' as const;
  public readonly modes = [Game.Mode.HigherOrLower] as const;
  public properties = {
    channelId: {
      type: Source.PropType.String,
      message: 'First channel username or ID',
      required: true,
    },
    secondChannelId: {
      type: Source.PropType.String,
      message: 'Second channel username or ID (optional)',
    },
    thirdChannelId: {
      type: Source.PropType.String,
      message: 'Third channel username or ID (optional)',
    },
  };

  public override async fetchHigherOrLowerItems(properties: Properties) {
    const channelIds = [
      properties.channelId,
      properties.secondChannelId,
      properties.thirdChannelId,
    ].filter(Boolean) as string[];

    const videos: Video[] = [];
    for (const channelId of channelIds) {
      await new Promise((r) => setTimeout(r, 1000));
      const channelVideos = await this._getChannelVideos(channelId);
      videos.push(...channelVideos);
    }

    // A minimum of 80 items is required to ensure a good game
    if (videos.length < 80)
      throw new Error(
        `Only ${videos.length} videos were found across all channels, but at least 100 are required.`,
      );

    return videos.map((video) => ({
      name: video.title,
      value: video.viewCount,
      image: this._makeMaxResolution(video.videoThumbnails![0]!.url),
    }));
  }

  private async _getChannelVideos(channelId: string) {
    const videos: Video[] = [];
    let continuation: string = null!;

    while (videos.length < 200) {
      const latestVideos = await (continuation
        ? ytch.getChannelVideosMore.bind(ytch)
        : ytch.getChannelVideos.bind(ytch))({ continuation, channelId });

      const filteredVideos = latestVideos.items.filter(
        (video) =>
          // Exclude live streams
          !video.liveNow &&
          // Shorts are too easy to guess
          video.lengthSeconds > 60 &&
          // Must have a thumbnail
          video.videoThumbnails,
      );
      videos.push(...filteredVideos);

      if (!latestVideos.continuation) break;
      continuation = latestVideos.continuation;
    }

    return videos;
  }

  private _makeMaxResolution(thumbnailUrl: string) {
    const url = new URL(thumbnailUrl);
    const path = url.pathname.split('/');
    path.splice(-1, 1, 'maxresdefault.jpg');
    url.pathname = path.join('/');
    return url.toString().split('?')[0]!;
  }
}
