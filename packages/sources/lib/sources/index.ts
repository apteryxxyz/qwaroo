import { source as GTAFandomTable } from './GTAFandomTable';
import { source as WikipediaTable } from './WikipediaTable';
import { source as YouTubeChannelVideoViews } from './YouTubeChannelVideoViews';

const sources = {
    [GTAFandomTable.slug]: GTAFandomTable,
    [WikipediaTable.slug]: WikipediaTable,
    [YouTubeChannelVideoViews.slug]: YouTubeChannelVideoViews,
};

export default sources;
