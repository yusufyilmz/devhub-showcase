import os from 'node:os'
import type { LoggerOptions } from 'pino'
import pino from 'pino'

const options: LoggerOptions = {
  base: {
    pid: process.pid,
    host: os.hostname(),
    application: process.env.APPLICATION_NAME,
    env: process.env.NODE_ENV
  },
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  formatters: {
    level(label) {
      return { level: label }
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  options.level = 'debug'
  options.transport = {
    target: 'pino-pretty'
  }
}

if (process.env.LOG_LEVEL) {
  options.level = process.env.LOG_LEVEL
}

export default pino(options)
