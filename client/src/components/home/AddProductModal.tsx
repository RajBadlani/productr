import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import { createProduct, updateProduct } from '../../api/products'
import type { Product, ProductFormData, ProductImage } from '../../types/product'
import ProductDropdown from './product-form/ProductDropdown'
import ProductFormField from './product-form/ProductFormField'
import ProductImageUploader, {
  type PreviewImage,
} from './product-form/ProductImageUploader'

type AddProductModalProps = {
  mode?: 'add' | 'edit'
  product?: Product
  onClose: () => void
  onSaved?: () => void
}

type FormErrors = Partial<Record<keyof ProductFormData | 'images', string>>

const productTypes = [
  'Foods',
  'Electronics',
  'Clothes',
  'Beauty Products',
  'Others',
] as const

const eligibilityOptions = ['Yes', 'No'] as const
const fieldSpacingClass = 'mt-[9px]'
const submitButtonClass =
  'flex h-[34px] w-[64px] cursor-pointer items-center justify-center rounded-[7px] bg-[#2334F3] text-[12px] font-semibold leading-[16px] text-white disabled:cursor-not-allowed disabled:opacity-70'
const allowedImageMimeTypes = ['image/png', 'image/jpeg', 'image/webp']
const unsupportedImageMessage =
  'SVG files are not supported. Please upload a PNG, JPG, JPEG, or WEBP image.'

const getImageUrl = (image: ProductImage) => {
  if (typeof image === 'string') return image
  return image.url || image.secureUrl || image.path || ''
}

const getInitialImages = (product?: Product): PreviewImage[] => {
  return (product?.images || [])
    .map((image, index) => ({ id: `existing-${index}`, src: getImageUrl(image) }))
    .filter((image) => image.src)
}

const getRequestErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message
  }

  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

const AddProductModal = ({
  mode = 'add',
  product,
  onClose,
  onSaved,
}: AddProductModalProps) => {
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false)
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [errors, setErrors] = useState<FormErrors>({})
  const [images, setImages] = useState<PreviewImage[]>(() => getInitialImages(product))
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    productType: product?.type || '',
    quantity: product?.quantityStock || '',
    mrp: product?.mrp || '',
    sellingPrice: product?.sellingPrice || '',
    brand: product?.brandName || '',
    eligibility: product?.exchangeEligible || product?.returnEligible ? 'Yes' : 'No',
  })

  const isEditMode = mode === 'edit'

  const closeMenus = () => {
    setIsProductTypeOpen(false)
    setIsEligibilityOpen(false)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === ''
            ? ''
            : Number(value)
          : value,
    }))

    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length === 0) return

    const hasUnsupportedFile = selectedFiles.some(
      (file) => !allowedImageMimeTypes.includes(file.type),
    )

    if (hasUnsupportedFile) {
      setErrors((prev) => ({ ...prev, images: unsupportedImageMessage }))
      setFileInputKey((prev) => prev + 1)
      return
    }

    const nextImages = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      src: URL.createObjectURL(file),
      file,
    }))

    setImages((prev) => [...prev, ...nextImages])
    setErrors((prev) => ({ ...prev, images: '' }))
    setFileInputKey((prev) => prev + 1)
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id))
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.productType) newErrors.productType = 'Product type is required'
    if (formData.quantity === '' || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }
    if (formData.mrp === '' || formData.mrp <= 0) {
      newErrors.mrp = 'MRP must be greater than 0'
    }
    if (formData.sellingPrice === '' || formData.sellingPrice <= 0) {
      newErrors.sellingPrice = 'Selling price must be greater than 0'
    }
    if (
      formData.sellingPrice !== '' &&
      formData.mrp !== '' &&
      formData.sellingPrice > formData.mrp
    ) {
      newErrors.sellingPrice = 'Selling price cannot be greater than MRP'
    }
    if (!formData.brand.trim()) newErrors.brand = 'Brand name is required'
    if (images.length === 0) newErrors.images = 'Product image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    try {
      setIsLoading(true)
      const newImageFiles = images.flatMap((image) => (image.file ? [image.file] : []))

      if (isEditMode && product) {
        const existingImageUrls = images.flatMap((image) => (image.file ? [] : [image.src]))
        await updateProduct(product._id, {
          name: formData.name,
          type: formData.productType,
          quantityStock: Number(formData.quantity),
          mrp: Number(formData.mrp),
          sellingPrice: Number(formData.sellingPrice),
          brandName: formData.brand,
          exchangeEligible: formData.eligibility === 'Yes',
          returnEligible: formData.eligibility === 'Yes',
        }, newImageFiles, existingImageUrls)
      } else {
        await createProduct(formData, newImageFiles)
      }

      onSaved?.()
      onClose()
    } catch (error) {
      const message = getRequestErrorMessage(error)
      setErrors((prev) => ({ ...prev, images: message }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="fixed inset-0 z-50 bg-[rgba(116,126,150,0.55)]">
      <section className="flex h-full items-center justify-center p-3 md:pl-[240px] md:py-[20px] md:pr-4">
        <section className="max-h-[calc(100vh-24px)] w-full max-w-[424px] overflow-y-auto rounded-[8px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] md:max-h-[calc(100vh-40px)]">
          <header className="sticky top-0 z-10 flex h-[44px] items-center justify-between border-b border-[#E5E7EB] bg-white px-4 md:px-[22px]">
            <span className="text-[16px] font-semibold leading-[22px] text-black">
              {isEditMode ? 'Edit Product' : 'Add Product'}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-[24px] leading-none text-black"
            >
              ×
            </button>
          </header>

          <form
            onSubmit={handleSubmit}
            className="px-4 py-[14px] md:px-[22px]"
            onClick={closeMenus}
          >
            <ProductFormField
              isPrimary
              label="Product Name"
              name="name"
              value={formData.name}
              placeholder="Enter product name"
              error={errors.name}
              onChange={handleChange}
            />

            <section className={fieldSpacingClass}>
              <ProductDropdown
                label="Product Type"
                value={formData.productType}
                placeholder="Select product type"
                options={productTypes}
                isOpen={isProductTypeOpen}
                error={errors.productType}
                onToggle={() => {
                  setIsEligibilityOpen(false)
                  setIsProductTypeOpen((open) => !open)
                }}
                onSelect={(option) => {
                  setFormData((prev) => ({ ...prev, productType: option }))
                  setErrors((prev) => ({ ...prev, productType: '' }))
                  setIsProductTypeOpen(false)
                }}
              />
            </section>

            <section className={fieldSpacingClass}>
              <ProductFormField
                label="Quantity Stock"
                name="quantity"
                type="number"
                value={formData.quantity}
                placeholder="Total numbers of Stock available"
                error={errors.quantity}
                onChange={handleChange}
              />
            </section>

            <section className={fieldSpacingClass}>
              <ProductFormField
                label="MRP"
                name="mrp"
                type="number"
                value={formData.mrp}
                placeholder="Enter MRP"
                error={errors.mrp}
                onChange={handleChange}
              />
            </section>

            <section className={fieldSpacingClass}>
              <ProductFormField
                label="Selling Price"
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                placeholder="Enter selling price"
                error={errors.sellingPrice}
                onChange={handleChange}
              />
            </section>

            <section className={fieldSpacingClass}>
              <ProductFormField
                label="Brand Name"
                name="brand"
                value={formData.brand}
                placeholder="Enter brand name"
                error={errors.brand}
                onChange={handleChange}
              />
            </section>

            <section className={fieldSpacingClass}>
              <ProductImageUploader
                images={images}
                fileInputKey={fileInputKey}
                error={errors.images}
                onImagesChange={handleImagesChange}
                onRemoveImage={removeImage}
              />
            </section>

            <section className={fieldSpacingClass}>
              <ProductDropdown
                label="Exchange or return eligibility"
                value={formData.eligibility}
                options={eligibilityOptions}
                isOpen={isEligibilityOpen}
                onToggle={() => {
                  setIsProductTypeOpen(false)
                  setIsEligibilityOpen((open) => !open)
                }}
                onSelect={(option) => {
                  setFormData((prev) => ({ ...prev, eligibility: option }))
                  setIsEligibilityOpen(false)
                }}
              />
            </section>

            <footer className="sticky bottom-0 mx-[-16px] mb-[-14px] mt-[12px] flex h-[56px] justify-end border-t border-[#E5E7EB] bg-[#F8FAFC] px-4 py-[10px] md:mx-[-22px] md:h-[48px] md:px-[22px] md:py-[7px]">
              <button type="submit" disabled={isLoading} className={submitButtonClass}>
                {isLoading ? '...' : isEditMode ? 'Update' : 'Create'}
              </button>
            </footer>
          </form>
        </section>
      </section>
    </section>
  )
}

export default AddProductModal
