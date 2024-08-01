import { logger } from './shared/logger'
import createServer from './app'
import { connectDb } from './config/db'
import { createRedisClient } from './config/redis'
import { loadEnv } from './shared/env'

const startServer = async () => {
  const port = process.env.PORT || 8000
  const app = createServer()

  try {
    loadEnv()
    await connectDb()
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
