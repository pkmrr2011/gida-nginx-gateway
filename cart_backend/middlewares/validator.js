import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'

export const ajvValidate = (req, schema) => {
  const ajv = new Ajv({
    allErrors: true,
    strict: 'log',
  })
  addFormats(ajv)
  addErrors(ajv)
  const validate = ajv.compile(schema)
  return { valid: validate(req.body), validate }
}

export const requestValidator = (schema) => {
  return async (req, res, next) => {
    try {
      const { valid, validate } = ajvValidate(req, schema)

      if (!valid) {
        const message = validate.errors?.map((error) => error?.message)?.join(', ')
        const result = { success: false, error: message }

        return res.status(400).json(result)
      } else {
        return next()
      }
    } catch (error) {
      const result = { success: false, error: error?.message }

      return res.status(400).json(result)
    }
  }
}
