import express from 'express'
import cartController from '../controllers/cart'
import { verifyInternalToken } from '../middlewares/authenticate'
import { requestValidator } from '../middlewares/validator'
import cartSchema from '../schema/cart'

const router = express.Router()

router.post('/add-to-cart', verifyInternalToken, requestValidator(cartSchema), cartController.addToCart)

export default router
