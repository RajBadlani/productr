type ProductsEmptyStateProps = {
  title: string
  description: string
}

const wrapperClass = 'flex flex-1 items-center justify-center px-6 pb-[78px]'
const contentClass = 'flex flex-col items-center text-center'
const titleClass =
  'mt-[14px] mb-0 text-[14px] font-semibold leading-[20px] text-[#475467]'
const descriptionClass =
  'mt-[6px] max-w-[220px] text-[11px] leading-[15px] text-[#98A2B3]'

const ProductsEmptyState = ({ title, description }: ProductsEmptyStateProps) => {
  return (
    <section className={wrapperClass}>
      <section className={contentClass}>
        <img
          src="/assets/iconoir_grid-add.svg"
          alt={title}
          className="h-[44px] w-[44px]"
        />
        <h2 className={titleClass}>
          {title}
        </h2>
        <p className={descriptionClass}>
          {description}
        </p>
      </section>
    </section>
  )
}

export default ProductsEmptyState
