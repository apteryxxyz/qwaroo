import type { APISource } from '@qwaroo/types';
import Image from 'next/image';
import { Card } from '../Card';
import { proxifyImageUrl } from '#/utilities/url';

export function Source(props: Source.Props) {
    // Reduce would be better here but I prefer the readability of this
    const requiredProperties = props.source.properties
        .filter(property => property.required)
        .map(prop => prop.name);

    return <Card className={'flex ' + (props.onClick ? 'cursor-pointer' : '')}>
        <Image
            src={proxifyImageUrl(props.source.iconUrl)}
            alt={`Icon for ${props.source.name}`}
            width={100}
            height={100}
        />

        <div onClick={props.onClick} className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold">{props.source.name}</h3>

            <p>{props.source.description}</p>

            <small>
                Requires the following inputs: {requiredProperties.join(', ')}
            </small>
        </div>
    </Card>;
}

export namespace Source {
    export interface Props {
        source: APISource;
        onClick?(): void;
    }
}
