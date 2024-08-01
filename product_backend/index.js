import { logger } from './shared/logger'
import createServer from './app'
import { executeDb } from './config/index'
import { createRedisClient } from './config/redis'
import { loadEnv } from './shared/env'

const startServer = async () => {
  const port = process.env.PORT || 8000
  const app = createServer()

  try {
    loadEnv()
    await executeDb()
    logger.info(`Connected successfully to the database.`)
    createRedisClient()
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}.`)
    })
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`)
    process.exit(1)
  }
}

startServer()
