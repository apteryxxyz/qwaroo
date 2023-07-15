import { sources } from '@qwaroo/data-sources';
import { Game, User } from '@qwaroo/database';
import { GameCreateSchema } from '@qwaroo/validators';
import { NextResponse } from 'next/server';
import z from 'zod';
import { bucket } from '@/services/Bucket';
import { imgur } from '@/services/Imgur';
import { ServerConnection } from '@/utilities/ws/ServerConnection';
import { getSession } from '@/utilities/ws/helpers';

export interface ServerEvents {
    on: (keyof BrowserEvents)[];
    off: (keyof BrowserEvents)[];
    create: z.infer<typeof GameCreateSchema> & {
        sourceSlug: keyof typeof sources;
        sourceProperties: Record<string, unknown>;
    };
}

export interface BrowserEvents {
    status: string;
    error: string;
    done: string;
}

export function GET() {
    return new NextResponse('Upgrade Required', { status: 426 });
}

export async function SOCKET(
    client: import('ws').WebSocket,
    request: import('http').IncomingMessage
) {
    // Ensure that the request is coming from the same origin as the server
    try {
        const origin = new URL(request.headers.origin ?? '');
        const url = new URL(process.env['EXTERNAL_URL']!);
        if (origin.hostname !== url.hostname) return;
    } catch {
        return;
    }

    const session = await getSession(request);
    if (!session?.user) return;
    const user = await User.Model.findById(session.user.id);
    if (!user) return;

    const connection = new ServerConnection<ServerEvents, BrowserEvents>(client);

    connection.on('create', async payload => {
        const result = GameCreateSchema.safeParse(payload);
        if (!result.success) return connection.send('error', result.error.message);
        const source = sources[payload.sourceSlug];
        if (!source) return connection.send('error', 'Invalid source');

        connection.send('status', 'Validating game options');
        const sourceOptions = payload.sourceProperties;
        const validateResult = await source
            .validateOptions(sourceOptions) //
            .catch((error: Error) => connection.send('error', error.message));
        if (!validateResult) return;

        connection.send('status', 'Getting data for the game');
        const gameItems = await source
            .fetchItems(sourceOptions as any) //
            .catch((error: Error) => connection.send('error', error.message));
        if (!gameItems) return;

        // Upload the thumbnail image to imgur, imgur is used because it's free and
        // easy to use, and the images are public anyway
        connection.send('status', 'Saving thumbnail image');
        const imageResult = await imgur
            .upload({
                type: 'stream',
                image: Buffer.from(payload.thumbnailBinary, 'binary'),
            })
            .then(result => {
                if (result.data.nsfw)
                    return connection.send('error', 'Thumbnail image is not allowed');
                if (!result.success) return connection.send('error', 'Thumbnail image save failed');
                // @ts-expect-error - I don't know why this is an error
                payload.thumbnailUrl = result.data.link;
                return true;
            });
        if (!imageResult) return;

        const game = new Game.Model({ creator: user, ...payload });

        // Save the game items to the bucket, done before saving the game so that
        // if the bucket save fails, we don't have a game without items in the bucket
        connection.send('status', 'Saving game items');
        const data = Buffer.from(JSON.stringify(gameItems));
        const bucketResult = await bucket
            .createFile(user, data, { gameId: game.id })
            .catch((error: Error) => connection.send('error', error.message));
        if (!bucketResult) return;

        // Save the game to the database
        connection.send('status', 'Saving game');
        const saveResult = await game
            .save()
            .catch((error: Error) => connection.send('error', error.message));
        if (!saveResult) return;

        connection.send('done', game.id);
    });
}
