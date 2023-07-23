import ytch from 'yt-channel-info';
import { Source } from '../source';

type Channel = Awaited<ReturnType<typeof ytch.getChannelInfo>>;
type Video = Awaited<ReturnType<typeof ytch.getChannelVideos>>['items'][0];

interface Properties {
  channelId: string;
  secondChannelId?: string;
  thirdChannelId?: string;
}

export class YouTubeChannelVideoViews extends Source<Properties> {
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
      description:
        'Channel whose videos will be used in the game, ensure that in total there are at least 100 videos.',
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

  public async validateProperties(properties: Partial<Properties>) {
    const channelIds = [
      properties.channelId ?? '',
      properties.secondChannelId,
      properties.thirdChannelId,
    ];
    const channels: Channel[] = [];

    for (const [index, channelId] of channelIds.entries()) {
      // Only the first channel ID is required
      if (!channelId && index > 0) continue;

      if (!channelId)
        throw new Error(
          `No YouTube channel ID was provided for channel #${index + 1}.`,
        );

      const channel = await ytch
        .getChannelInfo({ channelId })
        .catch(() => null);

      if (!channel || channel.alertMessage)
        throw new Error(`No YouTube channel was found for "${channelId}".`);

      channels.push(channel);
    }

    return `Your game will feature videos from ${channels
      .map((channel) => channel.author)
      .join(', ')}.`;
  }

  public async fetchItems(properties: Properties) {
    const channelIds = [
      properties.channelId,
      properties.secondChannelId,
      properties.thirdChannelId,
    ].filter(Boolean) as string[];

    const videos: Video[] = [];

    for (const channelId of channelIds) {
      const channelVideos = await this._getChannelVideos(channelId);
      videos.push(...channelVideos);
    }

    if (videos.length < 100)
      throw new Error(
        `Only ${videos.length} videos were found across all channels, but at least 100 are required.`,
      );

    return videos.map((video) => ({
      display: video.title,
      value: video.viewCount,
      imageUrl: this._makeMaxResolution(video.videoThumbnails![0].url),
      imageFrame: 'fill' as const,
    }));
  }

  private async _getChannelVideos(channelId: string) {
    const channelVideos: Video[] = [];
    let continuation: string = null!;

    while (channelVideos.length < 200) {
      const latestVideos = await (continuation
        ? ytch.getChannelVideosMore.bind(ytch)
        : ytch.getChannelVideos.bind(ytch)
      ).bind(ytch)({ continuation, channelId });

      const filteredVideos = latestVideos.items.filter(
        (video) =>
          !video.liveNow &&
          // Shorts are too easy to guess
          video.lengthSeconds > 60 &&
          video.videoThumbnails,
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
