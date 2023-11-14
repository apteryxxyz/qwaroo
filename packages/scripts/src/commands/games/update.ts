import { Command } from '@commander-js/extra-typings';
import { format, logger } from '@qwaroo/shared/logger';
import { sources, useGame, useGameItems, useGameSource } from '@qwaroo/sources';

export default new Command('update')
  .description("Update a game's items")
  .argument('<slug>', 'The slug of the game to update')
  .action(async (slug) => {
    const spinner = logger.spinner(`Updating '${slug}'...`);

    const [game, setGame] = await useGame(slug).catch(() => [] as const);
    if (!game || !setGame) {
      spinner.fail(format.error(`Game with slug '${slug}' does not exist.`));
      process.exit(1);
    }

    const [source] = await useGameSource(slug);
    const updater = sources[source.slug];
    if (!updater) {
      spinner.fail(format.error(`Updater '${source.slug}' does not exist.`));
      process.exit(1);
    }

    spinner.text = `Updating '${game.title}'...`;

    const [, setItems] = await useGameItems(slug);
    const updated = await updater.fetchItems(game.mode, source as never);
    await setItems(updated);

    if (!game.created) game.created = Date.now();
    game.updated = Date.now();
    await setGame(game);

    spinner.succeed(
      format.success(`Updated '${game.title}' with ${updated.length} items.`),
    );
  });
