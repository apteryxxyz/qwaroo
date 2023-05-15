import type { APISource } from '@qwaroo/types';
import Image from 'next/image';
import { Card } from '../Card';
import { proxifyImageUrl } from '#/utilities/url';

export function Source(props: Source.Props) {
    // Reduce would be better here but I prefer the readability of this
    const requiredProperties = props.source.properties
        .filter(property => property.required)
        .map(prop => prop.name);

    return <Card
        className={'flex ' + (props.onClick ? 'cursor-pointer' : '')}
        onClick={props.onClick}
    >
        {/* Mobile card has icon and title inline */}
        <div className="block md:hidden">
            <div className="flex items-center justify-center gap-4">
                <Image
                    src={proxifyImageUrl(props.source.iconUrl)}
                    alt={`Icon for ${props.source.name}`}
                    width={100}
                    height={100}
                />

                <h3 className="text-2xl font-bold h-full">
                    {props.source.name}
                </h3>
            </div>

            <div>
                <p>{props.source.description}</p>

                <small>
                    Requires the following inputs:{' '}
                    {requiredProperties.join(', ')}
                </small>
            </div>
        </div>

        {/* On desktop the icon is inline with a div containing the  */}
        <div className="hidden md:flex gap-4">
            <Image
                src={proxifyImageUrl(props.source.iconUrl)}
                alt={`Icon for ${props.source.name}`}
                width={100}
                height={100}
            />

            <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold">{props.source.name}</h3>

                <p>{props.source.description}</p>

                <small>
                    Requires the following inputs:{' '}
                    {requiredProperties.join(', ')}
                </small>
            </div>
        </div>
    </Card>;
}

export namespace Source {
    export interface Props {
        source: APISource;
        onClick?(): void;
    }
}
