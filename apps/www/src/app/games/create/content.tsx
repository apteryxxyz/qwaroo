'use client';

import type { Source } from '@qwaroo/data-sources';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/Card';

interface ContentProps {
    sources: Source.Entity[];
}

export default function Content(props: ContentProps) {
    return <Card>
        <Card.Header>
            <Card.Title>Choose A Source</Card.Title>
            <Card.Description>
                Games are automatically created using a source and a set of properties. Choose a
                source from below to get started!
            </Card.Description>
        </Card.Header>

        <Card.Content className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {props.sources.map(source => <Link
                key={source.slug}
                href={`/games/create/options?source=${source.slug}`}
            >
                <Card>
                    <Card.Header className="flex-row gap-6 items-center">
                        <Image
                            src={source.iconUrl}
                            width={75}
                            height={75}
                            alt="s"
                            className="aspect-square object-contain"
                        />

                        <div>
                            <Card.Title>{source.name}</Card.Title>
                            <Card.Description>{source.description}</Card.Description>
                        </div>
                    </Card.Header>
                </Card>
            </Link>)}
        </Card.Content>
    </Card>;
}
