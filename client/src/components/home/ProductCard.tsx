import { useState } from 'react'
import type { Product, ProductImage } from '../../types/product'

export type ProductCardData = Product
export type { ProductImage }

type ProductCardProps = {
  product: ProductCardData
  onDelete: (id: string) => void
  onEdit: (product: ProductCardData) => void
  onTogglePublish: (product: ProductCardData) => void
}

const cardClass =
  'w-[330px] rounded-[16px] border border-[#E5E7EB] bg-white p-[14px] shadow-[0_4px_14px_rgba(15,23,42,0.12)]'
const imageFrameClass =
  'flex h-[178px] items-center justify-center overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F8FAFC]'
const detailRowClass = 'flex items-center justify-between gap-4 text-[14px] leading-[20px]'
const detailLabelClass = 'text-[#98A2B3]'
const detailValueClass = 'text-right font-medium text-[#475467]'
const actionButtonClass =
  'flex h-[36px] cursor-pointer items-center justify-center rounded-[8px] text-[14px] font-semibold leading-[20px]'

const getImageSrc = (image: ProductImage) => {
  if (!image) return ''
  if (typeof image === 'string') return image

  return image.url || image.secureUrl || image.path || ''
}

const getImageUrls = (product: ProductCardData) => {
  return (product.images || []).map(getImageSrc).filter(Boolean)
}

const ProductCard = ({ product, onDelete, onEdit, onTogglePublish }: ProductCardProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const imageUrls = getImageUrls(product)
  const activeImageIndex = Math.min(selectedImageIndex, Math.max(imageUrls.length - 1, 0))
  const imageSrc = imageUrls[activeImageIndex]
  const isPublished = Boolean(product.isPublished)
  const eligibility = product.exchangeEligible || product.returnEligible ? '.YES' : '.NO'

  return (
    <article className={cardClass}>
      <section className={imageFrameClass}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-[12px] text-[#98A2B3]">No image</span>
        )}
      </section>

      {imageUrls.length > 1 ? (
        <section className="mt-[-7px] flex justify-center">
          <span className="flex min-h-[15px] min-w-[35px] items-center justify-center gap-[4px] rounded-full bg-white px-[7px] shadow-[0_1px_4px_rgba(15,23,42,0.14)]">
            {imageUrls.map((imageUrl, index) => (
              <button
                key={`${imageUrl}-${index}`}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`h-[6px] w-[6px] cursor-pointer rounded-full ${
                  index === activeImageIndex ? 'bg-[#FF5A3C]' : 'bg-[#D9DEE7]'
                }`}
                aria-label={`Show product image ${index + 1}`}
              />
            ))}
          </span>
        </section>
      ) : null}

      <h3 className="mt-[12px] text-[14px] font-semibold leading-[20px] text-[#111827]">
        {product.name}
      </h3>

      <section className="mt-[8px] space-y-[4px]">
        <p className={detailRowClass}>
          <span className={detailLabelClass}>Product type -</span>
          <span className={detailValueClass}>{product.type || 'Food'}</span>
        </p>
        <p className={detailRowClass}>
          <span className={detailLabelClass}>Quantity Stock -</span>
          <span className={detailValueClass}>{product.quantityStock}</span>
        </p>
        <p className={detailRowClass}>
          <span className={detailLabelClass}>MRP-</span>
          <span className={detailValueClass}>₹ {product.mrp}</span>
        </p>
        <p className={detailRowClass}>
          <span className={detailLabelClass}>Selling Price -</span>
          <span className={detailValueClass}>₹ {product.sellingPrice}</span>
        </p>
        <p className={detailRowClass}>
          <span className={detailLabelClass}>Brand Name -</span>
          <span className={detailValueClass}>{product.brandName}</span>
        </p>
        <p className={detailRowClass}>
          <span className={detailLabelClass}>Total Number of images -</span>
          <span className={detailValueClass}>{product.images?.length || 0}</span>
        </p>
        <p className={detailRowClass}>
          <span className={detailLabelClass}>Exchange Eligibility -</span>
          <span className={detailValueClass}>{eligibility}</span>
        </p>
      </section>

      <section className="mt-[18px] grid grid-cols-[1fr_1fr_40px] gap-[10px]">
        <button
          type="button"
          onClick={() => onTogglePublish(product)}
          className={`${actionButtonClass} ${
            isPublished ? 'bg-[#32D50B]' : 'bg-[#2334F3]'
          } text-white`}
        >
          {isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button
          type="button"
          onClick={() => onEdit(product)}
          className={`${actionButtonClass} border border-[#D0D5DD] bg-white text-[#475467]`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(product._id)}
          className="flex h-[36px] cursor-pointer items-center justify-center rounded-[8px] border border-[#D0D5DD] bg-white text-[#98A2B3]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 3h6m-8 5h10m-9 0 .7 12h6.6L16 8M10 11v6m4-6v6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </section>
    </article>
  )
}

export default ProductCard
