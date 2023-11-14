import { Command } from '@commander-js/extra-typings';
import { input, select } from '@inquirer/prompts';
import { logger } from '@qwaroo/shared/logger';
import { Game } from '@qwaroo/shared/types';
import { sources, useGame, useGameItems, useGameSource } from '@qwaroo/sources';
import _ from 'lodash';
import slugify from 'slugify';

export default new Command('new')
  .description('Create a brand new game')
  .action(async () => {
    const mode = await select({
      message: 'Choose a game mode',
      choices: Object.entries(Game.Mode) //
        .map(([name, value]) => ({ name: _.words(name).join(' '), value })),
    });

    const source = await select({
      message: 'Choose a data source...',
      choices: Object.values(sources) //
        .filter((s) => s.modes.includes(mode))
        .map((s) => ({ name: s.name, value: s })),
    });

    const properties = { slug: source.slug };
    for (const [key, prop] of Object.entries(source.properties)) {
      const method = 'choices' in prop ? select : input;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      Reflect.set(properties, key, await method({ ...(prop as any) }));
    }

    const title = await input({ message: 'Game title' });
    const slug = slugify(title, { lower: true, strict: true });
    const description = await input({ message: 'Game description' });
    const image = await input({
      message: 'Game image URL',
      validate: (v) => v.startsWith('http'),
    });
    const tags = await input({ message: 'Game tags' }) //
      .then((tags) => tags.split(','));

    const data = _.omitBy(
      { mode, slug, title, description, image, tags, seo: {} },
      _.isEmpty.bind(void 0),
    ) as unknown as Game;

    if (data.mode === Game.Mode.HigherOrLower) {
      const verb = await input({ message: 'Value verb' });
      const noun = await input({ message: 'Value noun' });
      const higher = await input({ message: 'Higher text' });
      const lower = await input({ message: 'Lower text' });
      const prefix = await input({ message: 'Value prefix (optional)' });
      const suffix = await input({ message: 'Value suffix (optional)' });

      data['strings'] = _.omitBy(
        { verb, noun, higher, lower, prefix, suffix },
        _.isEmpty.bind(void 0),
      ) as unknown as Game.HigherOrLower['strings'];
    }

    data['created'] = Date.now();

    const [, setGame] = await useGame(data.slug);
    const [, setProperties] = await useGameSource(data.slug);
    const [, setItems] = await useGameItems(data.slug);
    await Promise.all([setProperties(properties), setGame(data), setItems([])]);
    logger.success(`Created '${title}'`);
  });
