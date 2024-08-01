import express from 'express'
import userController from '../controllers/user'
import { verifyInternalToken } from '../middlewares/authenticate'
import { requestValidator } from '../middlewares/validator'
import loginSchema from '../schema/login'
import sendOtpSchema from '../schema/sendOtp'

const router = express.Router()

router.get('/', verifyInternalToken, userController.getUsers)
router.post('/send-otp', verifyInternalToken, requestValidator(sendOtpSchema), userController.sendOtp)
router.post('/login', verifyInternalToken, requestValidator(loginSchema), userController.login)

export default router
