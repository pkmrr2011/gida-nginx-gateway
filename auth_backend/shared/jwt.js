import jwt from 'jsonwebtoken'
import { getEnv } from './env'

const env = getEnv()

export const createJwtToken = (user) => {
  try {
    const token = jwt.sign(user, env?.jwtSecretKey, {
      expiresIn: env.jwtTokenExpiryTime,
    })

    return token
  } catch (error) {
    throw new Error(`Error creating token: ${error.message}`)
  }
}

export const verifyJwtToken = (token) => {
  try {
    const decoded = jwt.verify(token, env?.jwtSecretKey)
    return decoded
  } catch (error) {
    throw new Error(`Error verifying token: ${error.message}`)
  }
}
