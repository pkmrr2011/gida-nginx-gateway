import express from 'express'
import productController from '../controllers/product'
import { verifyInternalToken } from '../middlewares/authenticate'

const router = express.Router()

router.get('/', verifyInternalToken, productController.getProducts)
router.get('/:sku', verifyInternalToken, productController.getSingleProduct)

export default router
