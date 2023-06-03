import { Source } from '../structures/Source';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Options = {
    channelId: string;
    secondChannelId?: string;
    thirdChannelId?: string;
};

export class YouTubeChannelVideoViews extends Source<Options> {
    public slug = 'youtube-channel-video-views';
    public name = 'YouTube Channel Video Views';
    public description =
        'Fetch videos from one to three YouTube channels and use their view counts to play a Higher or Lower guessing game.';
    public iconUrl =
        'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png';
    public isPublic = true;

    public properties = {
        channelId: {
            type: Source.PropType.String,
            name: 'Channel ID',
            description: '',
            required: true as const,
            minimum: 24,
            maximum: 24,
        },
        secondChannelId: {
            type: Source.PropType.String,
            name: 'Second Channel ID (Optional)',
            description: '',
            minimum: 24,
            maximum: 24,
        },
        thirdChannelId: {
            type: Source.PropType.String,
            name: 'Third Channel ID (Optional)',
            description: '',
            minimum: 24,
            maximum: 24,
        },
    };

    public toArray() {
        return [this.slug, this] as const;
    }
}
