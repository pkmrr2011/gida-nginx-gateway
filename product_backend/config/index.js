import { connectDb } from './db'
import { processCSV } from './import_product'

export const executeDb = async () => {
  try {
    await connectDb()
    await processCSV()
  } catch (error) {
    throw new Error(`Error: ${error}`)
  }
}
