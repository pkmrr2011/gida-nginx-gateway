import express from 'express'
import requestLogger from './middlewares/requestLogger'
import userRoutes from './routes/user'
import { logger } from './shared/logger'
import { verifyJwtToken } from './shared/jwt'

const createServer = () => {
  const app = express()

  app.use(express.json({ limit: '60mb' }))
  app.use(express.urlencoded({ extended: true }))

  app.use(requestLogger)
  app.use('/api/v1/users', userRoutes)

  app.get('/', async (_req, res) => {
    return res.status(200).json({
      success: true,
      message: 'The server is running',
    })
  })

  app.get('/health', async (_req, res) => {
    return res.status(200).json({
      success: true,
      message: 'The server is running',
    })
  })

  app.get('/authentication', (req, res) => {
    try {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]

      if (!token) throw new Error(`Token is missing`)

      verifyJwtToken(token)

      return res.status(200).json({
        success: true,
        message: 'Authentication Passed',
      })
    } catch (error) {
      logger.error(`Authentication failed: ${error?.message}`)
      return res.status(401).json({
        success: false,
        message: `Authentication failed: ${error?.message}`,
      })
    }
  })

  app.use('*', async (_req, res) => {
    return res.status(404).send({
      success: false,
      message: 'URL_NOT_FOUND',
    })
  })

  return app
}

export default createServer
