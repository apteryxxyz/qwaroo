import { Sources } from '@qwaroo/data-sources';
import { Game, User } from '@qwaroo/database';
import { bucket } from '@/services/Bucket';
import { imgur } from '@/services/Imgur';
import { getSession, parseJson, sendMessage } from '@/utilities/wsHelpers';

export async function SOCKET(
    client: import('ws').WebSocket,
    request: import('http').IncomingMessage,
    server: import('ws').WebSocketServer
) {
    const session = await getSession(request);
    if (!session?.user) return client.close();
    const user = await User.Model.findById(session.user.id);
    if (!user) return client.close();

    client.on('message', async (message: Buffer) => {
        const { type, payload } = parseJson(message.toString('utf8')) ?? {};

        // Only type for this route is 'create'
        if (!type || type !== 'create') return;

        const source = Sources[payload.sourceSlug as keyof typeof Sources];
        if (!source) return sendMessage(client, 'error', 'Invalid source.');

        sendMessage(client, 'progress', 'Validating game options');
        const sourceOptions = payload.sourceOptions;
        const validateResult = await source.validateOptions(sourceOptions).catch((error: Error) => {
            sendMessage(client, 'error', error.message);
            return null;
        });
        if (validateResult === null) return;

        sendMessage(client, 'progress', 'Getting data for the game');
        const gameItems = await source.fetchItems(sourceOptions).catch((error: Error) => {
            sendMessage(client, 'error', error.message);
            return null;
        });
        if (gameItems === null) return;

        // Upload the thumbnail image to imgur, imgur is used because it's free and
        // easy to use, and the images are public anyway
        sendMessage(client, 'progress', 'Saving thumbnail image');
        const imageResult = await imgur
            .upload({
                image: Buffer.from(payload.thumbnailBinary, 'binary'),
                type: 'stream',
            })
            .then(result => {
                if (!result.success)
                    return sendMessage(client, 'error', 'Saving thumbnail image failed');
                if (result.data.nsfw)
                    return sendMessage(client, 'error', 'Thumbnail image is not allowed');
                return result.data;
            });
        if (!imageResult) return;
        payload.thumbnailUrl = imageResult.link;

        const game = new Game.Model({ creator: user, ...payload });

        // Save the game items to the bucket, done before saving the game so that
        // if the bucket save fails, we don't have a game without items in the bucket
        sendMessage(client, 'progress', 'Saving game items');
        const data = Buffer.from(JSON.stringify(gameItems));
        const bucketResult = await bucket
            .createFile(user, data, {
                gameId: game.id,
                gameSlug: game.slug,
            })
            .catch((error: Error) => {
                sendMessage(client, 'error', error.message);
                return null;
            });
        if (bucketResult === null) return;

        // Save the game to the database
        sendMessage(client, 'progress', 'Saving game');
        const saveResult = await game.save().catch((error: Error) => {
            sendMessage(client, 'error', error.message);
            return null;
        });
        if (saveResult === null) return;

        sendMessage(client, 'done', { game, file: bucketResult });
    });
}
