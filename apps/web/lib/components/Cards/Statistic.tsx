import { CountUpNumber } from '../Count/Number';
import { CountUpString } from '../Count/String';

export namespace StatisticCard {
    export interface Props {
        value: string | number;
        description: string;
        formatNumber?(value: number): string;
    }
}

export function StatisticCard({
    value,
    description,
    formatNumber,
}: StatisticCard.Props) {
    return <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white dark:bg-neutral-800">
        <span className="text-2xl font-semibold">
            {typeof value === 'number' ? (
                <CountUpNumber endValue={value} format={formatNumber} />
            ) : (
                <CountUpString endValue={value} />
            )}
        </span>

        <p>{description}</p>
    </div>;
}
