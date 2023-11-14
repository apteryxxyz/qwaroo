// The IMDb search source doesn't currently work

import { Game } from '@qwaroo/shared/types';
import * as cheerio from 'cheerio';
import { Source } from '@/classes/source';
import { fetchCheerio, getElement, parseNumber } from '@/utilities';

interface Properties {
  titleType: ImdbSearch['properties']['titleType']['choices'][number]['value'];
  sortParameter: ImdbSearch['properties']['sortParameter']['choices'][number]['value'];
  sortDirection: ImdbSearch['properties']['sortDirection']['choices'][number]['value'];
  valueProperty: ImdbSearch['properties']['valueProperty']['choices'][number]['value'];
}

export class ImdbSearch extends Source<
  readonly [Game.Mode.HigherOrLower],
  Properties
> {
  public readonly name = 'IMDb Search' as const;
  public readonly slug = 'imdb-search' as const;
  public readonly modes = [Game.Mode.HigherOrLower] as const;
  public properties = {
    titleType: {
      type: Source.PropType.String,
      message: 'Choose the type of search to use',
      choices: [
        { name: 'Feature', value: 'feature' },
        { name: 'TV Series', value: 'tv_series' },
        { name: 'TV Episode', value: 'tv_episode' },
        { name: 'TV Special', value: 'tv_special' },
        { name: 'Video', value: 'video' },
        { name: 'Video Game', value: 'video_game' },
      ] as const,
      required: true,
    },
    sortParameter: {
      type: Source.PropType.String,
      message: 'Choose the sort parameter',
      choices: [
        { name: 'Moviemeter', value: 'moviemeter' },
        { name: 'User Rating', value: 'user_rating' },
        { name: 'Number of Votes', value: 'num_votes' },
        { name: 'Release Date', value: 'release_date' },
        { name: 'Alphabetical', value: 'alpha' },
      ] as const,
      required: true,
    },
    sortDirection: {
      type: Source.PropType.String,
      message: 'Choose the sort direction',
      choices: [
        { name: 'Ascending', value: 'asc' },
        { name: 'Descending', value: 'desc' },
      ] as const,
      required: true,
    },
    valueProperty: {
      type: Source.PropType.String,
      message: 'Choose the property to use',
      choices: [
        { name: 'Rating', value: 'rating' },
        { name: 'Number of Votes', value: 'votes' },
        { name: 'Duration', value: 'duration' },
        { name: 'Release Year', value: 'releaseYear' },
      ] as const,
      required: true,
    },
  };

  public override async fetchHigherOrLowerItems(properties: Properties) {
    return this._getItems(
      properties.titleType,
      properties.sortParameter,
      properties.sortDirection,
    ).then((items) =>
      items.map((item) => ({
        name: item.title,
        value: item[properties.valueProperty],
        image: item.imageUrl,
      })),
    );
  }

  private async _getItems(
    titleType: string,
    sortParameter: string,
    sortDirection: string,
  ) {
    const url = new URL('search/title', 'https://www.imdb.com');
    url.searchParams.set('title_type', titleType);
    url.searchParams.set('sort', `${sortParameter},${sortDirection}`);
    url.searchParams.set('view', 'advanced');

    const $ = await fetchCheerio(url);

    // FIXME: Sometimes this works, sometimes it doesn't
    const rawDesc = getElement($, '.desc', true);
    if (!rawDesc) throw new Error('Failed to find description');

    const totalMatch = /of (\d+,?\d*) titles/.exec(rawDesc) ?? [''];
    const totalTitles = parseNumber(totalMatch[1]!.replaceAll(',', '')) ?? 0;
    const totalPages = Math.min(Math.ceil(totalTitles / 50), 1000);

    const items = await this._fetchPage(url);
    for (let i = 0; i < totalPages; i++) {
      await new Promise((r) => setTimeout(r, 200));
      const nextItems = await this._fetchPage(items.nextUrl);
      items.nextUrl = nextItems.nextUrl;
      items.push(...nextItems);
    }
    return items;
  }

  private async _fetchPage(url: URL) {
    const $ = await fetchCheerio(url);
    const nextUrl = this._getNextUrl($);

    return Object.assign(
      $('.lister-item')
        .map((_, e, $e = cheerio.load(e)) => ({
          title: this._getTitle($e)!,
          description: this._getDescription($e)!,
          rating: this._getRating($e)!,
          votes: this._getVotes($e)!,
          releaseYear: this._getReleaseYear($e)!,
          duration: this._getDuration($e)!,
          imageUrl: this._getImageUrl($e)!,
        }))
        .get()
        .flat(),
      { nextUrl },
    );
  }

  private _getNextUrl($: cheerio.CheerioAPI) {
    const href = getElement($, '.desc a[class*="next-page"]')?.attr('href');
    // FIXME: Errors here, for some reason not every page has .desc
    if (!href) throw new Error('Failed to find next page a tag');
    return new URL(href, 'https://www.imdb.com');
  }

  private _getTitle($: cheerio.CheerioAPI) {
    return getElement($, '.lister-item-header > a', true);
  }

  private _getDescription($: cheerio.CheerioAPI) {
    return getElement($, '.lister-item-content > p:nth-child(2)', true).trim();
  }

  private _getRating($: cheerio.CheerioAPI) {
    return parseNumber(getElement($, '.ratings-imdb-rating', true));
  }

  private _getVotes($: cheerio.CheerioAPI) {
    return parseNumber(
      getElement($, '.sort-num_votes-visible > span:nth-child(2)', true),
    );
  }

  private _getReleaseYear($: cheerio.CheerioAPI) {
    return parseNumber(getElement($, '.lister-item-year', true));
  }

  private _getDuration($: cheerio.CheerioAPI) {
    return parseNumber(getElement($, '.runtime', true));
  }

  private _getImageUrl($: cheerio.CheerioAPI) {
    return (
      getElement($, '.lister-item-image > a > img')
        ?.attr('loadlate')
        ?.split('V1')[0] + 'V1_.jpg'
    );
  }
}
