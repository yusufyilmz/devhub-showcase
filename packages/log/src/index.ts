import os from "node:os";

import type { LoggerOptions } from "pino";
import pino from "pino";

const options: LoggerOptions = {
  base: {
    application: process.env.APPLICATION_NAME,
    env: process.env.NODE_ENV,
    host: os.hostname(),
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

export default pino(options);
