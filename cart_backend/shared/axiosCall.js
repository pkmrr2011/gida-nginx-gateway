import axios from 'axios'
import { logger } from './logger'
import { getEnv } from './env'

const env = getEnv()

export const makeRequest = async (method, url, data = {}) => {
  try {
    logger.info(`${method.toUpperCase()} request to ${url} called with data: ${JSON.stringify(data)}`)

    const headers = { 'Content-Type': 'application/json', 'x-custom-header': env.internalToken }

    const config = {
      method,
      url,
      headers,
    }

    if (method === 'get') {
      config.params = data
    } else {
      config.data = data
    }

    const response = await axios(config)

    logger.info(`Response of ${method.toUpperCase()} ${url} is : ${JSON.stringify(response?.data)}`)

    return response?.data?.data
  } catch (error) {
    logger.error(`${method.toUpperCase()} request to ${url} failed: ${error?.response?.data?.message}`)
    throw new Error(`${method.toUpperCase()} request to ${url} failed: ${error?.response?.data?.message}`)
  }
}
