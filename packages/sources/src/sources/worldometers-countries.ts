import { Game } from '@qwaroo/shared/types';
import * as cheerio from 'cheerio';
import { Source } from '@/classes/source';
import { fetchCheerio, getImageFor } from '@/utilities';

interface Properties {
  statisticKey: WorldometersCountries['properties']['statisticKey']['choices'][number]['value'];
}

export class WorldometersCountries extends Source<
  readonly [Game.Mode.HigherOrLower],
  Properties
> {
  public readonly name = 'Worldometers Countries' as const;
  public readonly slug = 'worldometers-countries' as const;
  public readonly modes = [Game.Mode.HigherOrLower] as const;
  public properties = {
    statisticKey: {
      type: Source.PropType.String,
      message: 'Choose a statistic',
      choices: [
        { name: 'Population', value: 'population' },
        { name: 'Density', value: 'density' },
        { name: 'Land Area', value: 'landArea' },
        { name: 'Fertility Rate', value: 'fertilityRate' },
        { name: 'Median Age', value: 'medianAge' },
        { name: 'World Share', value: 'worldShare' },
      ] as const,
      required: true,
    },
  };

  public override async fetchHigherOrLowerItems(properties: Properties) {
    return this._getItems()
      .then((items) =>
        Promise.all(
          items.map(async (country) => ({
            name: country.name,
            value: country[properties.statisticKey],
            image: await getImageFor(country.name),
          })),
        ),
      )
      .then((items) => items.filter((i) => i.image));
  }

  private async _getItems(): Promise<
    ({ name: string } & Record<Properties['statisticKey'], number>)[]
  > {
    const url = new URL(
      'world-population/population-by-country',
      'https://www.worldometers.info',
    );
    const $ = await fetchCheerio(url);

    const getNth = (e: cheerio.Element, i: number) =>
      $(e).find(`td:nth-of-type(${i})`).text().trim();

    return $('tbody tr')
      .map((_, e) => ({
        name: getNth(e, 2),
        population: Number(getNth(e, 3).replaceAll(',', '')),
        density: Number(getNth(e, 6).replaceAll(',', '')),
        landArea: Number(getNth(e, 7).replaceAll(',', '')),
        fertilityRate: Number(getNth(e, 9).replaceAll(',', '')),
        medianAge: Number(getNth(e, 10).replaceAll(',', '')),
        worldShare: Number(getNth(e, 12).replaceAll(',', '')),
      }))
      .get();
  }
}
