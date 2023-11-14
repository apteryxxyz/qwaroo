import chalk from 'chalk';
import symbols from 'log-symbols';
import ora from 'ora';

export const format = {
  error: chalk.redBright.bold,
  warning: chalk.yellowBright.bold,
  success: chalk.greenBright.bold,
};

export const logger = {
  info: (...m: string[]) => console.log(...m),
  spinner: (m: string) => ora(m).start(),
  error: (...m: string[]) => console.error(symbols.error, format.error(...m)),
  warn: (...m: string[]) => console.warn(symbols.warning, format.warning(...m)),
  success: (...m: string[]) =>
    console.log(symbols.success, format.success(...m)),
};
