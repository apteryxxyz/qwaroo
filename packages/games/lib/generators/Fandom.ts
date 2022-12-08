import { Buffer } from 'node:buffer';
import { URL } from 'node:url';
import type { Game } from '@owenii/types';
import * as cheerio from 'cheerio';
import Jimp from 'jimp';
import { Generator } from './Generator';

export class FandomGenerator<T extends Game.Type> extends Generator<T> {
    private readonly _fullMeta: Game.Meta<T>;

    private readonly _fandomUrl: string;
    private readonly _shouldCheckImage: boolean;

    private readonly _getItemUrls: ($: cheerio.CheerioAPI) => string[];
    private readonly _getDisplay: ($: cheerio.CheerioAPI) => string;
    private readonly _getValue: ($: cheerio.CheerioAPI) => number;
    private readonly _getImageSource: ($: cheerio.CheerioAPI) => string;
    private readonly _getCaption?: ($: cheerio.CheerioAPI) => string;

    public constructor(
        meta: Game.Meta<T>,
        config: {
            fandomUrl: string;
            shouldCheckImage: boolean;
            getItemUrls($: cheerio.CheerioAPI): string[];
            getDisplay($: cheerio.CheerioAPI): string;
            getValue($: cheerio.CheerioAPI): string;
            getImageSource($: cheerio.CheerioAPI): string;
            getCaption?($: cheerio.CheerioAPI): string;
        }
    ) {
        super(meta.slug);
        this._fullMeta = meta;

        this._fandomUrl = config.fandomUrl;
        this._shouldCheckImage = config.shouldCheckImage;

        this._getItemUrls = config.getItemUrls;
        this._getDisplay = config.getDisplay;
        this._getValue = $ =>
            Number(
                /\$(?<value>[\d,.]+)/
                    .exec(config.getValue($))?.[1]
                    .replaceAll(',', '') ?? 0
            );
        this._getImageSource = config.getImageSource;
        this._getCaption = config.getCaption;
    }

    public async fetchMeta() {
        return this._fullMeta;
    }

    public async fetchItems(debugLog = false) {
        const url = new URL(this._fandomUrl);
        const content = await fetch(url.href).then(res => res.text());
        const $ = cheerio.load(content);

        const itemUrlPaths = this._getItemUrls($);
        const itemHrefs = itemUrlPaths.map(href => new URL(href, url).href);

        const items: Game.Item<T>[] = [];
        let lastProgress = 0;

        for (const [index, href] of itemHrefs.entries()) {
            const percent = Math.round((index / itemHrefs.length) * 100);
            if (debugLog && percent % 10 === 0 && percent !== lastProgress) {
                this.logger.info(`Getting items... ${percent}%`);
                lastProgress = percent;
            }

            const data = await this._getFandomData(href);
            if (data) items.push(data);
        }

        if (debugLog && lastProgress !== 100)
            this.logger.info('Getting items... 100%');

        return items;
    }

    private async _getFandomData(fandomUrl: string) {
        const content = await fetch(fandomUrl).then(res => res.text());
        const $ = cheerio.load(content);

        const display = this._getDisplay($);
        const value = this._getValue($);
        const imageSource = this._getImageSource($);
        const caption = this._getCaption?.($);

        if (!display || !value || !imageSource) return null;

        let imageFrame: 'fill' | 'fit' = 'fill';
        if (this._shouldCheckImage) {
            const imageBlob = await fetch(imageSource).then(res => res.blob());
            const imageBuffer = await imageBlob.arrayBuffer();
            const jimpImage = await Jimp.read(Buffer.from(imageBuffer));
            if (jimpImage.hasAlpha()) imageFrame = 'fit';
        }

        return { display, value, imageSource, imageFrame, caption };
    }
}
