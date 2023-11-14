import { Game } from '@qwaroo/shared/types';
import _ from 'lodash';
import { Source } from '@/classes/source';

interface Properties {
  jsonId: string;
  namePath: string;
  valuePath: string;
  imagePath: string;
  displayPath?: string;
  imageFrame?: GtaBase['properties']['imageFrame']['choices'][number]['value'];
}

export class GtaBase extends Source<
  readonly [Game.Mode.HigherOrLower],
  Properties
> {
  public readonly name = 'GTA Base' as const;
  public readonly slug = 'gta-base' as const;
  public readonly modes = [Game.Mode.HigherOrLower] as const;
  public properties = {
    jsonId: {
      type: Source.PropType.Number,
      message: 'The ID of the JSON file to use',
      required: true,
    },
    namePath: {
      type: Source.PropType.String,
      message: 'The path to the name property',
      required: true,
    },
    valuePath: {
      type: Source.PropType.String,
      message: 'The path to the value property',
      required: true,
    },
    imagePath: {
      type: Source.PropType.String,
      message: 'The path to the image property',
      required: true,
    },
    displayPath: {
      type: Source.PropType.String,
      message: 'The path to the display property (optional)',
    },
    imageFrame: {
      type: Source.PropType.String,
      message: 'The image frame to use (optional)',
      choices: [
        { name: 'Fill', value: 'fill' },
        { name: 'Fit', value: 'fit' },
      ] as const,
    },
  };

  public override async fetchHigherOrLowerItems(properties: Properties) {
    return this._getItems(properties.jsonId)
      .then((items) =>
        items.map((item) => ({
          name: String(_.get(item, properties.namePath) ?? ''),
          value: Number.parseFloat(
            String(_.get(item, properties.valuePath) ?? 0),
          ),
          image: this._buildUrl(
            String(_.get(item, properties.imagePath) ?? ''),
          ),
          display: properties.displayPath
            ? String(_.get(item, properties.displayPath) ?? '')
            : undefined,
          frame: properties.imageFrame,
        })),
      )
      .then((items) => items.filter((i) => i.image && i.value > 0));
  }

  private _getItems(id: string) {
    return fetch(this._buildUrl(`media/com_jamegafilter/en_gb/${id}.json`))
      .then((r) => r.json())
      .then(Object.values);
  }

  private _buildUrl(uri: string) {
    return new URL(uri, 'https://www.gtabase.com')
      .toString()
      .replaceAll(/(_[0-9]+x[0-9]+|\/resized)/g, '');
  }
}
