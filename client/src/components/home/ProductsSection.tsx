import { useState } from 'react'
import AddProductModal from './AddProductModal'
import ProductCard, { type ProductCardData } from './ProductCard'
import { useProducts } from '../../hooks/useProducts'

const pageHeaderClass = 'flex h-[64px] items-center justify-between px-[34px]'
const addButtonClass =
  'flex items-center gap-[8px] text-[18px] font-medium leading-[24px] text-[#475467]'
const gridClass = 'grid grid-cols-3 gap-[24px] px-[34px]'
const toastClass =
  'absolute bottom-[28px] left-1/2 flex h-[42px] -translate-x-1/2 items-center gap-[12px] rounded-[8px] bg-white px-[12px] shadow-[0_8px_24px_rgba(15,23,42,0.16)]'

const ProductsSection = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductCardData | null>(null)
  const [toast, setToast] = useState('')
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
      setToast('Product deleted Successfully')
    } catch {
      setToast('Failed to delete product')
    }
  }

  async function handleTogglePublish(product: ProductCardData) {
    try {
      await togglePublish(product)
    } catch {
      setToast('Failed to toggle publish status')
    }
  }

  function handleCreated() {
    setToast('Product added Successfully')
    void refetchProducts()
  }

  function handleEdited() {
    setToast('Product updated Successfully')
    void refetchProducts()
  }

  function closeProductModal() {
    setIsAddProductOpen(false)
    setEditingProduct(null)
  }

  return (
    <section className="relative flex min-h-0 flex-1 flex-col">
      <header className="flex h-[39px] items-center border-b border-[#E5E7EB] px-[14px]">
        <section className="flex items-center gap-[6px] text-[#475467]">
          <img src="/assets/Bag-icon.svg" alt="" className="h-[12px] w-[12px]" />
          <span className="text-[14px] font-medium">Products</span>
        </section>
      </header>

      <section className={pageHeaderClass}>
        <h1 className="m-0! text-[18px]! font-semibold! leading-[24px]! text-[#475467]!">
          Products
        </h1>
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null)
            setIsAddProductOpen(true)
          }}
          className={`${addButtonClass} cursor-pointer`}
        >
          <span className="text-[24px] font-normal leading-none">+</span>
          Add Products
        </button>
      </section>

      {loading ? (
        <section className="flex flex-1 items-center justify-center">
          <p className="text-[12px] text-[#98A2B3]">Loading...</p>
        </section>
      ) : products.length === 0 ? (
        <section className="flex flex-1 items-center justify-center px-6 pb-[108px]">
          <section className="flex flex-col items-center text-center">
            <img src="/assets/iconoir_grid-add.svg" alt="Products" className="h-[44px] w-[44px]" />
            <h2 className="mt-[16px] mb-0 text-[14px] font-semibold leading-[20px] text-[#475467]">
              Feels a little empty over here...
            </h2>
            <p className="mt-[6px] max-w-[265px] text-[11px] leading-[15px] text-[#98A2B3]">
              You can create products without connecting store you can add products to store anytime
            </p>
            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="mt-[16px] flex h-[29px] w-[195px] items-center justify-center rounded-[6px] bg-[#2B33F6] text-[11px] font-semibold leading-[15px] text-white"
            >
              Add your Products
            </button>
          </section>
        </section>
      ) : (
        <section className={`${gridClass} overflow-y-auto pb-[80px]`}>
          {products.map((product) => (
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

      {toast ? (
        <section className={toastClass}>
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[6px] bg-[#20B486] text-white">
            ✓
          </span>
          <span className="text-[14px] font-semibold leading-[20px] text-[#475467]">
            {toast}
          </span>
          <button
            type="button"
            onClick={() => setToast('')}
            className="text-[20px] leading-none text-[#475467]"
          >
            ×
          </button>
        </section>
      ) : null}

      {isAddProductOpen || editingProduct ? (
        <AddProductModal
          mode={editingProduct ? 'edit' : 'add'}
          product={editingProduct || undefined}
          onClose={closeProductModal}
          onSaved={editingProduct ? handleEdited : handleCreated}
        />
      ) : null}
    </section>
  )
}

export default ProductsSection
