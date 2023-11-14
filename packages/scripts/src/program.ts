#!/usr/bin/env node
import { program } from '@commander-js/extra-typings';
import games from './commands/games';

program.name('qwaroo').addCommand(games).parse();
if (!process.argv.slice(2).length) program.outputHelp();
