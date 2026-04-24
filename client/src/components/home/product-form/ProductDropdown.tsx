type ProductDropdownProps<T extends string> = {
  label: string
  value: T | ''
  placeholder?: string
  options: readonly T[]
  isOpen: boolean
  error?: string
  onToggle: () => void
  onSelect: (value: T) => void
}

const labelClass = 'block text-[12px] font-medium leading-[16px] text-black'
const buttonClass =
  'flex h-[30px] w-full cursor-pointer items-center justify-between rounded-[7px] border border-[#E5E7EB] bg-white px-[10px] text-[12px] leading-[16px] text-[#98A2B3]'
const menuClass =
  'absolute left-0 top-[36px] z-10 w-full rounded-[7px] border border-[#E5E7EB] bg-white p-[4px] shadow-[0_8px_20px_rgba(15,23,42,0.12)]'
const optionClass =
  'flex h-[28px] w-full cursor-pointer items-center rounded-[4px] px-[8px] text-left text-[12px] leading-[16px] text-black'

const ProductDropdown = <T extends string>({
  label,
  value,
  placeholder = 'Select option',
  options,
  isOpen,
  error,
  onToggle,
  onSelect,
}: ProductDropdownProps<T>) => {
  return (
    <section>
      <label className={labelClass}>{label}</label>
      <section className="relative mt-[6px]">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggle()
          }}
          className={`${buttonClass} ${error ? 'border-red-500' : ''}`}
        >
          <span>{value || placeholder}</span>
          <img src="/assets/down-icon.svg" alt="" className="h-[16px] w-[16px]" />
        </button>

        {isOpen ? (
          <section className={menuClass}>
            {options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect(option)
                }}
                className={`${optionClass} ${index === 0 ? 'bg-[#F3F4F6]' : ''}`}
              >
                {option}
              </button>
            ))}
          </section>
        ) : null}
      </section>
      {error ? <p className="mt-[3px] text-[10px] text-red-500">{error}</p> : null}
    </section>
  )
}

export default ProductDropdown
