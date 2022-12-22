const process = require('node:process');
const { Database, Game } = require('@owenii/database');
const { fetchAndSaveItems } = require('@owenii/sources');
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
    const debug = process.env['DEBUG'] === 'true';
    const games = await Game.find({ sourceSlug: { $ne: null } });

    await Promise.all(games.map(async gm => {
        if (!gm.sourceSlug || !gm.sourceOptions) return;
        if (debug) console.info(`Ensuring items for "${gm.title}" using "${gm.sourceSlug}"...`);
        await fetchAndSaveItems(gm.slug, gm.sourceSlug, gm.sourceOptions, debug);
        if (debug) console.info(`Done ensuring items for "${gm.title}"!`)
    }));
}