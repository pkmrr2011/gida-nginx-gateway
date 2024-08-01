import { Cart } from '../models/cart'
import { makeRequest } from '../shared/axiosCall'
import { redis } from '../config/redis'
import { getEnv } from '../shared/env'

const env = getEnv()

const userController = {
  addToCart: async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body

      let userData = await redis.hgetall(`user-${userId}`)
      if (!userData || Object.keys(userData).length === 0) {
        userData = await makeRequest('get', env.authBackendUrl, { id: userId })
        if (!userData) throw new Error(`User not found with user id ${userId}`)
        await redis.hset(`user-${userId}`, userData)
      }

      let productDetails = await redis.hgetall(`product-${productId}`)
      if (!productDetails || Object.keys(productDetails).length === 0) {
        productDetails = await makeRequest('get', env.productBackendUrl, { id: productId })
        if (!productDetails) throw new Error(`Product not found with product id ${productId}`)
        await redis.hset(`product-${productId}`, productDetails)
      }

      const maxQuantity = parseInt(productDetails.max_quantity, 10)

      if (quantity > maxQuantity) {
        return res.status(400).send({
          success: false,
          message: `Quantity exceeds maximum allowed of ${maxQuantity}`,
        })
      }

      const cartItem = await Cart.findOne({ where: { user_id: userId, product_id: productId } })

      if (cartItem) {
        if (quantity === 0) {
          await cartItem.destroy()
          return res.status(200).send({ success: true, message: 'Cart item removed' })
        } else {
          cartItem.quantity = quantity
          await cartItem.save()
          return res.status(200).send({ success: true, message: 'Cart updated', cartItem })
        }
      } else {
        if (quantity > 0) {
          const newCartItem = await Cart.create({ user_id: userId, product_id: productId, quantity })
          return res.status(200).send({ success: true, message: 'Item added to cart', newCartItem })
        } else {
          return res.status(400).send({ success: false, message: 'Cannot add zero quantity to cart' })
        }
      }
    } catch (e) {
      return res.status(400).send({ success: false, message: e.message || 'Something went wrong' })
    }
  },
}

export default userController
