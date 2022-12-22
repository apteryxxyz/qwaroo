import { source as GTAFandom } from './GTAFandom';
import { source as Wikipedia } from './Wikipedia';
import { source as Worldometer } from './Worldometer';
import { source as YTChannel } from './YTChannel';

const sources = {
    [GTAFandom.slug]: GTAFandom,
    [Wikipedia.slug]: Wikipedia,
    [Worldometer.slug]: Worldometer,
    [YTChannel.slug]: YTChannel,
};

export default sources;
