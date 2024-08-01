import { Op } from 'sequelize'
import { Product } from '../models/product'
import { logger } from '../shared/logger'

const userController = {
  getProducts: async (req, res) => {
    try {
      const { limit, offset, search, id } = req.query

      const limitValue = limit ? parseInt(limit, 10) : 10
      const offsetValue = offset ? parseInt(offset, 10) : 0
      const whereObj = {}

      if (id) whereObj.id = id

      if (search) {
        whereObj.product_name = {
          [Op.iLike]: `%${search}%`,
        }
      }

      let products = await Product.findAll({
        where: whereObj,
        limit: limitValue,
        offset: offsetValue,
        order: [['created_at', 'DESC']],
      })

      if (id && products && products.length == 1) {
        products = products[0]
      }

      return res.status(200).send({ success: true, data: products })
    } catch (e) {
      logger.error(e)
      return res.status(400).send({ success: false, message: e.message || 'Something went wrong' })
    }
  },

  getSingleProduct: async (req, res) => {
    try {
      const { sku } = req.params
      const product = await Product.findOne({ where: { sku } })
      return res.status(200).send({ success: true, data: product })
    } catch (e) {
      logger.error(e)
      return res.status(400).send({ success: false, message: e.message || 'Something went wrong' })
    }
  },
}

export default userController
