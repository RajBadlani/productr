import { useState } from 'react'
import AddProductModal from './AddProductModal'
import ProductCard, { type ProductCardData } from './ProductCard'
import { useProducts } from '../../hooks/useProducts'

const pageHeaderClass = 'flex min-h-[64px] flex-col items-start justify-center gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 md:px-6 xl:px-[34px]'
const addButtonClass =
  'flex items-center gap-[8px] text-[16px] font-medium leading-[24px] text-[#475467] sm:text-[18px]'
const gridClass = 'grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-5 md:gap-5 md:px-6 xl:grid-cols-3 xl:px-[34px]'
const toastClass =
  'fixed bottom-4 left-4 right-4 z-40 flex min-h-[42px] items-center gap-[12px] rounded-[8px] bg-white px-[12px] py-2 shadow-[0_8px_24px_rgba(15,23,42,0.16)] sm:absolute sm:bottom-[28px] sm:left-1/2 sm:right-auto sm:w-max sm:min-w-[320px] sm:-translate-x-1/2 sm:py-0'

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
      <header className="flex h-[39px] items-center border-b border-[#E5E7EB] px-4 md:px-[14px]">
        <section className="flex items-center gap-[6px] text-[#475467]">
          <img src="/assets/Bag-icon.svg" alt="" className="h-[12px] w-[12px]" />
          <span className="text-[14px] font-medium">Products</span>
        </section>
      </header>

      <section className={pageHeaderClass}>
          <h1 className="m-0 text-[18px] font-semibold leading-[24px] text-[#475467]">
            Products
          </h1>
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null)
            setIsAddProductOpen(true)
          }}
           className={`${addButtonClass} cursor-pointer self-stretch sm:self-auto`}
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
         <section className="flex flex-1 items-center justify-center px-6 py-12 sm:pb-[108px] sm:pt-6">
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
               className="mt-[16px] flex h-[36px] w-full max-w-[220px] items-center justify-center rounded-[6px] bg-[#2B33F6] px-4 text-[12px] font-semibold leading-[15px] text-white"
            >
              Add your Products
            </button>
          </section>
        </section>
      ) : (
         <section className={`${gridClass} overflow-y-auto pb-[90px] sm:pb-[80px]`}>
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
          <span className="min-w-0 flex-1 text-[13px] font-semibold leading-[20px] text-[#475467] sm:text-[14px]">
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
