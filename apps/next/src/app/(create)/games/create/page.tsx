import { appRouter } from '@qwaroo/server';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/card';

export default async function Page() {
  const caller = appRouter.createCaller({});
  const sources = await caller.create.getSources();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Choose a source</Card.Title>
        <Card.Description>
          Games are automatically created using a source and a set of
          properties. Choose a source from below to get started!
        </Card.Description>
      </Card.Header>

      <Card.Content className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sources.map((source) => (
          <Link
            key={source.slug}
            href={`/games/create/properties?source=${source.slug}`}
          >
            <Card>
              <Card.Header className="flex-row items-center gap-6">
                <Image
                  src={source.iconUrl}
                  width={75}
                  height={75}
                  alt=" " //TODO:"
                  className="aspect-square object-contain"
                />

                <div>
                  <Card.Title>{source.name}</Card.Title>
                  <Card.Description>{source.description}</Card.Description>
                </div>
              </Card.Header>
            </Card>
          </Link>
        ))}
      </Card.Content>
    </Card>
  );
}
