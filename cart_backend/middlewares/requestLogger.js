import { logger } from '../shared/logger'

const requestLogger = (req, _res, next) => {
  const { method, url } = req

  logger.info(`Request received: ${method} - ${url}`)
  next()
}

export default requestLogger
