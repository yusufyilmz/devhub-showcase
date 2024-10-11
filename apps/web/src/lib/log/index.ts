import pino, { Logger, LoggerOptions } from 'pino'
import os from 'os'

export const createLogger = (hostname: string): Logger => {
  const options: LoggerOptions = {
    base: {
      pid: process.pid,
      host: hostname,
      application: process.env.APPLICATION_NAME
    },
    level: 'info'
  }

  if (process.env.LOG_LEVEL) {
    options.level = process.env.LOG_LEVEL
  }

  return pino(options)
}

export default createLogger(os.hostname())
