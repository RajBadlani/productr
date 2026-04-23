import Product from "../models/Product.js";
import User from "../models/User.js";

function getUploadedImageUrls(req) {
  return (req.files || []).map((file) => file.path)
}

function parseImages(value) {
  if (value === undefined) return undefined
  if (Array.isArray(value)) return value

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value
  return value === 'true'
}

export async function createProduct(req, res) {
  try {
    const { name, type, quantityStock, mrp, sellingPrice, brandName, exchangeEligible, returnEligible } = req.body
    const uploadedImages = getUploadedImageUrls(req)

    if (!name || !type || !quantityStock || !mrp || !sellingPrice || !brandName) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const product = await Product.create({
      name,
      type,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      exchangeEligible: parseBoolean(exchangeEligible),
      returnEligible: parseBoolean(returnEligible),
      images: uploadedImages,
      owner: req.userId,
    })

    await User.findByIdAndUpdate(req.userId, {
      $push: { products: product._id },
    })

    res.status(201).json({ message: 'Product created', product })
  } catch (error) {
    console.error('createProduct error:', error.message)
    res.status(500).json({ message: 'Failed to create product' })
  }
}

export async function getProducts(req, res) {
  try {
    const products = await Product.find({ owner: req.userId }).sort({ createdAt: -1 })
    res.status(200).json({ products })
  } catch (error) {
    console.error('getProducts error:', error.message)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
}

export async function getProduct(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id, owner: req.userId })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.status(200).json({ product })
  } catch (error) {
    console.error('getProduct error:', error.message)
    res.status(500).json({ message: 'Failed to fetch product' })
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id, owner: req.userId })
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const { name, type, quantityStock, mrp, sellingPrice, brandName, exchangeEligible, returnEligible, isPublished, existingImages } = req.body
    const retainedImages = parseImages(existingImages)
    const uploadedImages = getUploadedImageUrls(req)

    if (name) product.name = name
    if (type) product.type = type
    if (quantityStock) product.quantityStock = quantityStock
    if (mrp) product.mrp = mrp
    if (sellingPrice) product.sellingPrice = sellingPrice
    if (brandName) product.brandName = brandName
    if (exchangeEligible !== undefined) product.exchangeEligible = parseBoolean(exchangeEligible)
    if (returnEligible !== undefined) product.returnEligible = parseBoolean(returnEligible)
    if (isPublished !== undefined) product.isPublished = parseBoolean(isPublished)
    if (retainedImages !== undefined || uploadedImages.length > 0) {
      product.images = [...(retainedImages || []), ...uploadedImages]
    }

    await product.save()
    res.status(200).json({ message: 'Product updated', product })
  } catch (error) {
    console.error('updateProduct error:', error.message)
    res.status(500).json({ message: 'Failed to update product' })
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id, owner: req.userId })
    if (!product) return res.status(404).json({ message: 'Product not found' })

    await product.deleteOne()

    // remove product reference from user
    await User.findByIdAndUpdate(req.userId, {
      $pull: { products: product._id },
    })

    res.status(200).json({ message: 'Product deleted' })
  } catch (error) {
    console.error('deleteProduct error:', error.message)
    res.status(500).json({ message: 'Failed to delete product' })
  }
}

export async function uploadProductImages(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id, owner: req.userId })
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const urls = getUploadedImageUrls(req)
    product.images.push(...urls)
    await product.save()

    res.status(200).json({ message: 'Images uploaded', images: product.images })
  } catch (error) {
    console.error('uploadImages error:', error.message)
    res.status(500).json({ message: 'Failed to upload images' })
  }
}
