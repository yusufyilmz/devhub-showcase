// Chalk-based CLI helper (server-side only). This keeps browser bundle light and
// gives rich output in terminal scripts (e.g., bin/env/*) without changing
// existing logger behavior used across the app.
// Usage:
//   cli.success('Authenticated successfully')
//   cli.info('Generating .env contents...')
//   cli.warn('Missing variable: FOO')
//   cli.error('Failed to write file')
//   cli.title('My Task')
type ChalkLike = { [k: string]: any } & ((s: string) => string);
function loadChalk(): any {
  try {
    if (typeof window === "undefined") {
      // Use eval to prevent webpack bundling
      // eslint-disable-next-line no-eval
      // biome-ignore lint/security/noGlobalEval: Required to prevent webpack bundling server-only modules
      const chalk = eval("require")("chalk");
      return chalk.default || chalk;
    }
  } catch {
    return null;
  }
  return null;
}
const chalkCache: { ref: ChalkLike | null } = { ref: null };
const withChalk = (fn: (chalk: ChalkLike | null) => void) => {
  if (chalkCache.ref === null) {
    chalkCache.ref = loadChalk();
  }
  fn(chalkCache.ref);
};
export const cli = {
  error: (text: string) =>
    withChalk((chalk) => {
      if (chalk) {
        // biome-ignore lint/suspicious/noConsole: console is used for logging
        console.error(chalk.white.bgRed.bold(" ERROR "), chalk.red(text));
      } else {
        // biome-ignore lint/suspicious/noConsole: console is used for logging
        console.error(`[ERROR] ${text}`);
      }
    }),
  info: (text: string) =>
    withChalk((chalk) => {
      if (chalk) {
        // biome-ignore lint/suspicious/noConsole: console is used for logging
        console.info(chalk.green(`${text}\n`));
      } else {
        // biome-ignore lint/suspicious/noConsole: console is used for logging
        console.info(text);
      }
    }),
  success: (text: string) =>
    withChalk((chalk) => {
      if (chalk) {
        // biome-ignore lint/suspicious/noConsole: console is used for logging
        console.info(chalk.bgGray.green.bold(`${text}\n`));
      } else {
        // biome-ignore lint/suspicious/noConsole: console is used for logging
        console.info(`[OK] ${text}`);
      }
    }),
  title: (text: string) =>
    withChalk((chalk) => {
      const line = "─".repeat(Math.max(10, Math.min(60, text.length + 6)));
      if (chalk) {
        // biome-ignore lint/suspicious/noConsole: console is used for logging
        console.info(chalk.bgGray.white.bold(`\n ${text} \n${line}`));
      } else {
        // biome-ignore lint/suspicious/noConsole: console is used for logging
        console.info(`\n ${text} \n${line}`);
      }
    }),
  warn: (text: string) =>
    withChalk((chalk) => {
      if (chalk) {
        // biome-ignore lint/suspicious/noConsole: console is used for logging
        console.warn(chalk.black.bgYellow.bold(" WARN "), chalk.yellow(text));
      } else {
        // biome-ignore lint/suspicious/noConsole: console is used for logging
        console.warn(`[WARN] ${text}`);
      }
    }),
};
