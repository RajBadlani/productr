import express from 'express'
import { upload } from '../config/cloudinary.js'
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct, uploadProductImages } from '../controllers/productController.js'
import { protect } from '../middleware/auth.js'

const productRoutes = express.Router()

productRoutes.use(protect)

productRoutes.post('/', upload.array('images', 5), createProduct)
productRoutes.get('/', getProducts)
productRoutes.get('/:id', getProduct)
productRoutes.put('/:id', upload.array('images', 5), updateProduct)
productRoutes.delete('/:id', deleteProduct)

productRoutes.post('/:id/images', upload.array('images', 5), uploadProductImages)


export default productRoutes
