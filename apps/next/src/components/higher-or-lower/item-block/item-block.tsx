'use client';

import type { Game } from '@qwaroo/shared/types';
import {
  useHigherOrLowerSettings as useSettings,
  type HigherOrLowerSettingsState as SettingsState,
} from '@/hooks/use-settings';
import { proxifyImageUrl } from '@/utilities/url';
import { Button } from '../../ui/button';

export function ItemBlock(
  p: {
    game: Game.HigherOrLower;
    item: Game.HigherOrLower.Item;
  } & (
    | {
        shouldShowValue: true;
        currentValue: number | string | React.ReactNode;
      }
    | {
        shouldShowValue?: false;
        currentValue?: number | string | React.ReactNode;
      }
  ) &
    (
      | {
          shouldShowActions: true;
          onHigherClick(this: void): void;
          onLowerClick(this: void): void;
        }
      | {
          shouldShowActions?: false;
          onHigherClick?(this: void): void;
          onLowerClick?(this: void): void;
        }
    ),
) {
  const [{ imageCropping, imageQuality }] = useSettings(p.game.slug);
  const frame = croppingToFrame(imageCropping, p.item.frame);
  const quality = qualityToNumber(imageQuality);

  const imageUrl = new URL(p.item.image);
  const proxyUrl = proxifyImageUrl(imageUrl, quality);
  const displayUrl =
    {
      'i.ytimg.com': 'youtube.com',
      'images.unsplash.com': 'unsplash.com',
      'www.gtabase.com': 'gtabase.com',
    }[imageUrl.hostname] ?? imageUrl.hostname;

  return (
    <aside
      className="relative flex h-[50vh] w-screen select-none flex-col items-center justify-center bg-no-repeat p-10 xl:h-screen xl:w-[50vw] xl:pt-[30vw]"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(${proxyUrl.toString()})`,
        backgroundSize: frame === 'fit' ? 'contain' : 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="text-center text-2xl font-bold drop-shadow-2xl xl:text-5xl">
        {p.item.name}
      </h2>

      {p.item.caption && (
        <p className="text-md text-center xl:text-lg">{p.item.caption}</p>
      )}

      {p.game.strings.verb && (
        <span className="text-center text-lg">{p.game.strings.verb}</span>
      )}

      {p.shouldShowValue && (
        <span className="text-center text-4xl font-bold xl:text-7xl">
          {p.game.strings.prefix}
          {typeof p.currentValue === 'number'
            ? p.currentValue.toLocaleString()
            : p.currentValue}
          {p.game.strings.suffix}
        </span>
      )}

      {p.shouldShowActions && (
        <div className="flex space-x-2 font-bold p-4">
          <Button
            variant="red"
            className="py-5 text-xl font-bold xl:text-2xl"
            onClick={p.onHigherClick}
          >
            {p.game.strings.higher || 'Higher'}
          </Button>

          <Button
            variant="blue"
            className="py-5 text-xl font-bold xl:text-2xl"
            onClick={p.onLowerClick}
          >
            {p.game.strings.lower || 'Lower'}
          </Button>
        </div>
      )}

      {p.game.strings.noun && (
        <span className="text-center text-lg">{p.game.strings.noun}</span>
      )}

      <span className="absolute bottom-1 right-1 opacity-30">
        image via{' '}
        <a
          href={imageUrl.toString()}
          target="_blank"
          className="underline"
          rel="noreferrer"
        >
          {displayUrl}
        </a>
      </span>
    </aside>
  );
}

function croppingToFrame(
  cropping: SettingsState['imageCropping'] = 'auto',
  auto: Game.HigherOrLower.Item['frame'] = 'fill',
) {
  if (cropping === 'crop') return 'fill';
  if (cropping === 'none') return 'fit';
  return auto;
}

function qualityToNumber(quality: SettingsState['imageQuality'] = 'reduced') {
  return quality === 'max' ? 100 : 20;
}
