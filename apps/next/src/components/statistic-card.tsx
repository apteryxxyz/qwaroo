import { Combination } from './combination';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

export function StatisticCard(p: {
  imageUrl: string;
  description: string;
  value: number;
  valueFormatter?: (value: unknown) => string;
}) {
  return (
    <Card>
      <CardHeader className="items-center justify-center">
        <picture>
          <img
            src={p.imageUrl}
            alt={`${p.description} icon`}
            className="w-16 aspect-square"
          />
        </picture>

        <CardTitle className="text-2xl">
          <Combination endValue={p.value} endDisplay={p.valueFormatter} />
        </CardTitle>
        <CardDescription className="text-center">
          {p.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
