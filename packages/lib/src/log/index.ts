import os from "node:os";

import type { Logger, LoggerOptions } from "pino";
import pino from "pino";

const createLogger = (hostname: string): Logger => {
  const options: LoggerOptions = {
    base: {
      application: process.env.APPLICATION_NAME,
      host: hostname,
      pid: process.pid,
    },
    level: "info",
  };

  if (process.env.LOG_LEVEL) {
    options.level = process.env.LOG_LEVEL;
  }

  return pino(options);
};

const logger = createLogger(os.hostname());

export { logger };
