import { GtaBase } from './gta-base';
// import { ImdbSearch } from './imdb-search';
import { WorldometersCountries } from './worldometers-countries';
import { YouTubeChannelVideoViews } from './youtube-channel-video-views';

const a = new GtaBase();
// const b = new ImdbSearch();
const c = new WorldometersCountries();
const d = new YouTubeChannelVideoViews();

export const sources = {
  [a.slug]: a,
  // [b.slug]: b,
  [c.slug]: c,
  [d.slug]: d,
};
