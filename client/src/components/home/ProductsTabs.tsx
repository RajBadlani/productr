type ProductStatus = 'published' | 'unpublished'

type ProductsTabsProps = {
  activeStatus: ProductStatus
  onStatusChange: (status: ProductStatus) => void
}

const tabClass = 'px-0 pb-[8px] text-[14px]'
const activeTabClass = 'border-b border-[#2F9BFF] text-[#6B7280]'
const inactiveTabClass = 'text-[#D1D5DB]'

const ProductsTabs = ({ activeStatus, onStatusChange }: ProductsTabsProps) => {
  return (
    <nav className="border-b border-[#E5E7EB] px-[14px] pt-[11px]">
      <ul className="flex gap-[18px] font-semibold leading-[14px]">
        <li>
          <button
            type="button"
            onClick={() => onStatusChange('published')}
            className={`${tabClass} ${
              activeStatus === 'published'
                ? activeTabClass
                : inactiveTabClass
            }`}
          >
            Published
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => onStatusChange('unpublished')}
            className={`${tabClass} ${
              activeStatus === 'unpublished'
                ? activeTabClass
                : inactiveTabClass
            }`}
          >
            Unpublished
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default ProductsTabs
