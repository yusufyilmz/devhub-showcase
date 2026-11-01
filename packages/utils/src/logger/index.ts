import os from "node:os";

import pino, { type Logger, type LoggerOptions } from "pino";

const createLogger = (hostname: string): Logger => {
  const options: LoggerOptions = {
    base: {
      application: process.env.APPLICATION_NAME,
      env: process.env.NODE_ENV,
      host: hostname,
      pid: process.pid,
    },
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  };

  if (process.env.NODE_ENV !== "production") {
    options.level = "debug";
    options.transport = {
      target: "pino-pretty",
    };
  }

  if (process.env.LOG_LEVEL) {
    options.level = process.env.LOG_LEVEL;
  }

  return pino(options);
};

const logger = createLogger(os.hostname());

export { logger };
