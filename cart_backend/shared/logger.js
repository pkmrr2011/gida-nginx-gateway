import winston from 'winston'
import 'dotenv/config'

const commonOptions = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} - ${level.toUpperCase()} : ${message}`
    }),
  ),
}

const config = {
  transports: new winston.transports.Console(),
}

const logger = winston.createLogger({ ...commonOptions, ...config })
export { logger }
