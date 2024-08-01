const defaultEnv = {
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  databaseUrl: process.env.POSTGRES_URL,
  internalToken: process.env.INTERNAL_TOKEN,
  redisUrl: process.env.REDIS_URL,
}

const sanitizedEnv = {}

export const loadEnv = () => {
  Object.keys(defaultEnv).forEach((item) => {
    if (!defaultEnv[item]) throw new Error(`${item} env is not defined`)
    sanitizedEnv[item] = defaultEnv[item]
  })

  return defaultEnv
}

export const getEnv = () => sanitizedEnv
