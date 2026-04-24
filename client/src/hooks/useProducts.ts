import { useCallback, useEffect, useState } from 'react'
import {
  deleteProduct as deleteProductRequest,
  getProducts,
  updateProduct,
} from '../api/products'
import type { Product } from '../types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts()
      setProducts(data.products || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadProducts() {
      try {
        const data = await getProducts()
        if (isActive) setProducts(data.products || [])
      } catch {
        if (isActive) setProducts([])
      } finally {
        if (isActive) setLoading(false)
      }
    }

    void loadProducts()

    return () => {
      isActive = false
    }
  }, [])

  const deleteProduct = async (id: string) => {
    await deleteProductRequest(id)
    setProducts((prev) => prev.filter((product) => product._id !== id))
  }

  const togglePublish = async (product: Product) => {
    const nextPublishedState = !product.isPublished
    await updateProduct(product._id, { isPublished: nextPublishedState })
    setProducts((prev) =>
      prev.map((item) =>
        item._id === product._id
          ? { ...item, isPublished: nextPublishedState }
          : item,
      ),
    )
  }

  return {
    products,
    loading,
    refetchProducts: fetchProducts,
    deleteProduct,
    togglePublish,
  }
}
