import express from 'express'
import { upload } from '../config/cloudinary.js'
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct, uploadProductImages } from '../controllers/productController.js'
import { protect } from '../middleware/auth.js'

const productRoutes = express.Router()

const uploadProductFiles = (req, res, next) => {
  upload.array('images', 5)(req, res, (error) => {
    if (!error) {
      next()
      return
    }

    const statusCode = error.statusCode || (error.name === 'MulterError' ? 400 : 500)
    const message = error.message || 'Failed to upload product images'
    res.status(statusCode).json({ message })
  })
}

productRoutes.use(protect)

productRoutes.post('/', uploadProductFiles, createProduct)
productRoutes.get('/', getProducts)
productRoutes.get('/:id', getProduct)
productRoutes.put('/:id', uploadProductFiles, updateProduct)
productRoutes.delete('/:id', deleteProduct)

productRoutes.post('/:id/images', uploadProductFiles, uploadProductImages)


export default productRoutes
