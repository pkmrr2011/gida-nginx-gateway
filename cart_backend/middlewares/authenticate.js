import { getEnv } from '../shared/env'

const env = getEnv()

export const verifyInternalToken = (req, res, next) => {
  try {
    const authToken = String(req.headers['x-custom-header'])

    if (!authToken) return res.status(401).send({ success: false, message: 'Internal token is missing' })

    if (authToken == env.internalToken) next()
    else return res.status(403).send({ success: false, message: 'Not authorized' })
  } catch (error) {
    return res.status(403).send({ success: false, message: 'Not authorized' })
  }
}
