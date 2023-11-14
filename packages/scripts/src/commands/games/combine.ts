import { Command } from '@commander-js/extra-typings';
import { format, logger } from '@qwaroo/shared/logger';
import { combineGameMetas, useGames } from '@qwaroo/sources';

export default new Command('combine')
  .description('Combine all the games meta data into a single JSON file')
  .action(async () => {
    const spinner = logger.spinner('Combining games...');

    const [, setGames] = await useGames();
    await setGames(await combineGameMetas());

    spinner.succeed(format.success('Combined and saved games.'));
  });
