import axios from 'axios'
import type { ProductFormData, ProductUpdates } from '../types/product'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function appendProductFields(form: FormData, formData: ProductFormData) {
  form.append('name', formData.name)
  form.append('type', formData.productType)
  form.append('quantityStock', String(formData.quantity))
  form.append('mrp', String(formData.mrp))
  form.append('sellingPrice', String(formData.sellingPrice))
  form.append('brandName', formData.brand)
  form.append('exchangeEligible', String(formData.eligibility === 'Yes'))
  form.append('returnEligible', String(formData.eligibility === 'Yes'))
}

function appendFiles(form: FormData, imageFiles: File[]) {
  imageFiles.forEach((file) => form.append('images', file))
}

export async function createProduct(formData: ProductFormData, imageFiles: File[] = []) {
  const form = new FormData()
  appendProductFields(form, formData)
  appendFiles(form, imageFiles)

  const { data } = await api.post('/api/products', form)
  return data
}

export async function uploadProductImages(productId: string, imageFile: File) {
  const form = new FormData()
  form.append('images', imageFile)
  const { data } = await api.post(`/api/products/${productId}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function getProducts() {
  const { data } = await api.get('/api/products')
  return data
}

export async function updateProduct(
  id: string,
  updates: ProductUpdates,
  imageFiles?: File[],
  existingImages?: string[],
) {
  if (imageFiles || existingImages) {
    const form = new FormData()

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) form.append(key, String(value))
    })
    if (existingImages) form.append('existingImages', JSON.stringify(existingImages))
    appendFiles(form, imageFiles || [])

    const { data } = await api.put(`/api/products/${id}`, form)
    return data
  }

  const { data } = await api.put(`/api/products/${id}`, updates)
  return data
}

export async function deleteProduct(id: string) {
  const { data } = await api.delete(`/api/products/${id}`)
  return data
}
