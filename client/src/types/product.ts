export type ProductImage =
  | string
  | {
      url?: string
      path?: string
      secureUrl?: string
    }

export type Product = {
  _id: string
  name: string
  type: string
  quantityStock: number
  mrp: number
  sellingPrice: number
  brandName: string
  images?: ProductImage[]
  isPublished?: boolean
  exchangeEligible?: boolean
  returnEligible?: boolean
}

export type ProductFormData = {
  name: string
  productType: string
  quantity: number | ''
  mrp: number | ''
  sellingPrice: number | ''
  brand: string
  eligibility: 'Yes' | 'No'
}

export type ProductUpdates = Partial<{
  name: string
  type: string
  quantityStock: number
  mrp: number
  sellingPrice: number
  brandName: string
  isPublished: boolean
  exchangeEligible: boolean
  returnEligible: boolean
}>

export type ProductStatus = 'published' | 'unpublished'
export type DashboardSection = 'home' | 'products'
