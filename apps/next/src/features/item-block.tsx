import type { Game } from '@qwaroo/database';
import type { Source } from '@qwaroo/sources';
import { Button } from '@/components/button';
import { proxyImageUrl } from '@/utilities/url';

export interface ItemBlockProps
  extends Source.PartialItem,
    Pick<
      Game.Entity,
      | 'valueNoun'
      | 'valueVerb'
      | 'valuePrefix'
      | 'valueSuffix'
      | 'higherText'
      | 'lowerText'
    > {
  value?: number | React.ReactNode;
  onHigherClick?: () => void;
  onLowerClick?: () => void;
}

export function ItemBlock(p: ItemBlockProps) {
  const hasValue = p.value !== null && typeof p.value !== 'undefined';
  const imageUrl = new URL(p.imageUrl);
  const proxyUrl = proxyImageUrl(imageUrl);

  return (
    <aside
      className="relative flex h-[50vh] w-screen select-none flex-col items-center justify-center bg-no-repeat p-10 xl:h-screen xl:w-[50vw] xl:pt-[30vw]"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(${proxyUrl})`,
        backgroundSize: p.imageFrame === 'fit' ? 'contain' : 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="text-center text-2xl font-bold drop-shadow-2xl xl:text-5xl">
        {p.display}
      </h2>

      {p.caption && (
        <p className="text-md text-center xl:text-lg">{p.caption}</p>
      )}

      <span className="text-center text-lg">{p.valueVerb}</span>

      {hasValue && (
        <span className="text-center text-4xl font-bold xl:text-7xl">
          {p.valuePrefix}
          {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          {p.valueSuffix}
        </span>
      )}

      {p.onHigherClick && p.onLowerClick && !hasValue && (
        <div className="flex space-x-2 font-bold">
          <Button
            variant="red"
            className="py-5 text-xl font-bold xl:text-2xl"
            onClick={p.onHigherClick}
          >
            {p.higherText ?? 'Higher'}
          </Button>
          <Button
            variant="blue"
            className="py-5 text-xl font-bold xl:text-2xl"
            onClick={p.onLowerClick}
          >
            {p.lowerText ?? 'Lower'}
          </Button>
        </div>
      )}

      <span className="text-center text-lg">{p.valueNoun}</span>

      <span className="absolute bottom-1 right-1 opacity-30">
        image via{' '}
        <a href={imageUrl.toString()} className="underline">
          {imageUrl.hostname}
        </a>
      </span>
    </aside>
  );
}
