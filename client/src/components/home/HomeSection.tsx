import { useState } from 'react'
import AddProductModal from './AddProductModal'
import ProductCard, { type ProductCardData } from './ProductCard'
import ProductsEmptyState from './ProductsEmptyState'
import ProductsTabs from './ProductsTabs'
import { useProducts } from '../../hooks/useProducts'
import type { ProductStatus } from '../../types/product'

const contentByStatus = {
  published: {
    title: 'No Published Products',
    description: 'Your Published Products will appear here. Create your first product to publish.',
  },
  unpublished: {
    title: 'No Unpublished Products',
    description: 'Your Unpublished Products will appear here. Create your first product to publish.',
  },
} as const

const gridClass = 'grid grid-cols-3 gap-[24px] overflow-y-auto px-[34px] py-[34px]'

const HomeSection = () => {
  const [activeStatus, setActiveStatus] = useState<ProductStatus>('published')
  const [editingProduct, setEditingProduct] = useState<ProductCardData | null>(null)
  const {
    products,
    loading,
    deleteProduct,
    refetchProducts,
    togglePublish,
  } = useProducts()

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id)
    } catch {
      // Keep the current UI stable if the request fails.
    }
  }

  async function handleTogglePublish(product: ProductCardData) {
    try {
      await togglePublish(product)
    } catch {
      // Keep the current UI stable if the request fails.
    }
  }

  function closeEditModal() {
    setEditingProduct(null)
  }

  function handleEdited() {
    void refetchProducts()
  }

  const filtered = products.filter((p) =>
    activeStatus === 'published' ? p.isPublished : !p.isPublished
  )

  const currentContent = contentByStatus[activeStatus]

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <ProductsTabs activeStatus={activeStatus} onStatusChange={setActiveStatus} />

      {loading ? (
        <section className="flex flex-1 items-center justify-center">
          <p className="text-[12px] text-[#98A2B3]">Loading...</p>
        </section>
      ) : filtered.length === 0 ? (
        <ProductsEmptyState title={currentContent.title} description={currentContent.description} />
      ) : (
        <section className={gridClass}>
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
              onEdit={setEditingProduct}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </section>
      )}

      {editingProduct ? (
        <AddProductModal
          mode="edit"
          product={editingProduct}
          onClose={closeEditModal}
          onSaved={handleEdited}
        />
      ) : null}
    </section>
  )
}

export default HomeSection
