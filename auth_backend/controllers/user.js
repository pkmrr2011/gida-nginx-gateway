import { User } from '../models/user'
import { logger } from '../shared/logger'
import { generateOTP } from '../shared/utils'
import { createJwtToken } from '../shared/jwt'
import { redis } from '../config/redis'

const userController = {
  getUsers: async (req, res) => {
    try {
      const { id, limit, offset } = req.query

      const limitValue = limit ? parseInt(limit, 10) : 10
      const offsetValue = offset ? parseInt(offset, 10) : 0
      const whereObj = {}

      if (id) whereObj.id = id
      let users = await User.findAll({ where: whereObj, limit: limitValue, offset: offsetValue })

      if (id && users && users.length == 1) {
        users = users[0]
      }

      return res.status(200).send({ success: true, data: users })
    } catch (e) {
      logger.error(e)
      return res.status(400).send({ success: false, message: e.message || 'Something went wrong' })
    }
  },

  sendOtp: async (req, res) => {
    try {
      const { phone_number, name } = req.body

      let user = await User.findOne({ where: { phone_number } })

      const otp = generateOTP()

      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

      if (!user) {
        user = await User.create({
          phone_number,
          name,
          otp,
          otp_expires_at: otpExpiresAt,
          otp_attempts: 0,
        })

        await redis.hset(`user-${user.id}`, { id: user.id, phone_number: user.phone_number })
      } else {
        if (user && user.blocked_until && new Date() < user.blocked_until) {
          return res.status(403).json({
            success: false,
            message: `Too many failed attempts. Try again after ${user.blocked_until.toLocaleTimeString()}`,
          })
        }

        await user.update({
          otp: otp,
          otp_expires_at: otpExpiresAt,
          otp_attempts: 0,
          blocked_until: null,
        })
      }

      logger.info(`OTP sent to user: ${user.id}`)
      return res.status(200).send({ success: true, otp })
    } catch (e) {
      logger.error(e)
      return res.status(400).send({ success: false, message: e.message || 'Something went wrong' })
    }
  },

  login: async (req, res) => {
    try {
      const { phone_number, otp } = req.body

      const user = await User.findOne({ where: { phone_number } })

      if (!user) throw new Error(`User not found`)

      const now = new Date()

      if (user.blocked_until && now < user.blocked_until) {
        throw new Error(`Too many failed attempts. Try again after ${user.blocked_until.toLocaleTimeString()}`)
      }

      if (now > user.otp_expires_at) {
        throw new Error(`OTP has expired`)
      }

      if (user.otp !== otp) {
        await user.increment('otp_attempts')

        if (user.otp_attempts >= 5) {
          await user.update({
            blocked_until: new Date(Date.now() + 10 * 60 * 1000),
          })
          throw new Error(`Too many failed attempts. Try again in 10 minutes`)
        }

        throw new Error(`Wrong OTP`)
      }

      await user.update({ otp_attempts: 0 })

      const token = createJwtToken({ id: user.id, phone_number: user.phone_number })

      logger.info(`User logged in: ${user.id}`)
      return res.status(200).send({ success: true, token })
    } catch (e) {
      logger.error(e)
      return res.status(400).send({ success: false, message: e.message || 'Something went wrong' })
    }
  },
}

export default userController
