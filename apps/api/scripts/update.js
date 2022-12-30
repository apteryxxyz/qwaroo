const process = require('node:process');
const { Database, Game } = require('@qwaroo/database');
const { fetchAndSaveItems, loadItems } = require('@qwaroo/sources');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config();
dotenvExpand.expand(env);

const database = new Database();

void main();
async function main() {
    await database.connect();
    await ensureGameItems();
    await database.disconnect();
    process.exit(0);
}

async function ensureGameItems() {
    const verbose = process.env['VERBOSE'] === 'true';
    const games = await Game.find({ sourceSlug: { $ne: null } });

    await Promise.all(games.map(async game => {
        if (!game.sourceSlug || !game.sourceOptions) return;

        const existing = loadItems(game.slug);
        await fetchAndSaveItems(game.slug, game.mode,
            game.sourceSlug, game.sourceOptions, verbose);
        const updated = loadItems(game.slug);

        // Compare the existing and updated items to see if any were added or removed
        const added = updated.filter(up => !existing.some(ex => ex.id === up.id));
        const removed = existing.filter(ex => !updated.some(up => up.id === ex.id));

        if (added.length > 0 || removed.length > 0) {
            game.updatedTimestamp = Date.now();
            await game.save();
        }
    }));
}
