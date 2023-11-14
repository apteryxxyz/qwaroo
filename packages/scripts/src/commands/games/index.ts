import { Command } from '@commander-js/extra-typings';
import combine from './combine';
import _new from './new';
import update from './update';

export default new Command('games')
  .addCommand(update)
  .addCommand(_new)
  .addCommand(combine);
