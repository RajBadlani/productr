import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

const allowedImageMimeTypes = ['image/png', 'image/jpeg', 'image/webp']
const unsupportedImageMessage =
  'Please upload a PNG, JPG, JPEG, or WEBP image. SVG files are not supported.'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'productr/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  }),
})

export const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    if (allowedImageMimeTypes.includes(file.mimetype)) {
      callback(null, true)
      return
    }

    const error = new Error(unsupportedImageMessage)
    error.statusCode = 400
    callback(error)
  },
})

export { unsupportedImageMessage }
export default cloudinary
