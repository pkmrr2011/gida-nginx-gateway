import express from 'express'
import requestLogger from './middlewares/requestLogger'
import cartRoutes from './routes/cart'

const createServer = () => {
  const app = express()

  app.use(express.json({ limit: '60mb' }))
  app.use(express.urlencoded({ extended: true }))

  app.use(requestLogger)

  app.use('/api/v1/carts', cartRoutes)

  app.get('/', async (_req, res) => {
    return res.status(200).send({
      success: true,
      message: 'The server is running',
    })
  })

  app.get('/health', async (_req, res) => {
    return res.status(200).send({
      success: true,
      message: 'The server is running',
    })
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
