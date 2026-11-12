import os from "node:os";

import pino, { type Logger, type LoggerOptions } from "pino";

import { env } from "@shared/env";

export type { Logger, LoggerOptions };

const createLogger = (hostname: string): Logger => {
  const options: LoggerOptions = {
    base: {
      application: env.APPLICATION_NAME,
      env: env.NODE_ENV,
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

  if (env.NODE_ENV !== "production") {
    options.level = "debug";
    options.transport = {
      target: "pino-pretty",
    };
  }

  if (env.LOG_LEVEL) {
    options.level = env.LOG_LEVEL;
  }

  return pino(options);
};

const logger = createLogger(os.hostname());

export { logger };
