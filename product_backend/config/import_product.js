import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { Product } from '../models/product'
import { sequelize } from './db'
import { logger } from '../shared/logger'
import { redis } from './redis'

const csvFilePath = path.resolve(__dirname, '../data/products.csv')

const validateRow = (row) => {
  return (
    row.sku &&
    row.product_name &&
    row.description &&
    !isNaN(parseFloat(row.price)) &&
    !isNaN(parseInt(row.stock)) &&
    !isNaN(parseInt(row.max_quantity))
  )
}

const upsertProductsInBulk = async (rows) => {
  let transaction
  try {
    transaction = await sequelize.transaction()

    try {
      await Promise.all(
        rows.map(async (row) => {
          const product = await Product.upsert(
            {
              sku: row.sku,
              product_name: row.product_name,
              description: row.description || null,
              price: parseFloat(row.price),
              stock: parseInt(row.stock),
              max_quantity: parseInt(row.max_quantity),
            },
            { transaction, returning: true },
          )

          const productData = product[0].get({ plain: true })

          await redis.hset(`product-${productData.id}`, productData)
          logger.info(`Product saved to Redis with key: product-${productData.id}`)
        }),
      )

      await transaction.commit()
      logger.info('Bulk upsert completed successfully.')
    } catch (error) {
      if (transaction) await transaction.rollback()
      logger.error(`Error during bulk upsert: ${error.message}`)
    }
  } catch (error) {
    logger.error(`Error starting transaction: ${error.message}`)
  }
}

export const processCSV = async () => {
  try {
    logger.info('Starting CSV processing...')

    try {
      await fs.promises.access(csvFilePath)
    } catch (err) {
      logger.error(`File does not exist at path: ${csvFilePath}`)
      throw new Error(`File does not exist at path: ${csvFilePath}`)
    }

    const rows = []

    try {
      await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
            if (validateRow(row)) {
              rows.push(row)
            } else {
              logger.warn(`Invalid row: ${JSON.stringify(row)}`)
            }
          })
          .on('end', async () => {
            try {
              if (rows.length > 0) {
                await upsertProductsInBulk(rows)
              } else {
                logger.info('No valid rows to upsert.')
              }

              logger.info('CSV file processing completed.')
              resolve()
            } catch (error) {
              logger.error(`Error during CSV processing end: ${error.message}`)
              reject(error)
            }
          })
          .on('error', (error) => {
            logger.error(`Error reading CSV file: ${error.message}`)
            reject(error)
          })
      })
    } catch (error) {
      logger.error(`Error processing CSV file: ${error.message}`)
    }
  } catch (error) {
    logger.error(`Unexpected error during CSV processing: ${error.message}`)
  }
}
