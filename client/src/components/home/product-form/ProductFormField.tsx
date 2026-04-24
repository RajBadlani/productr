import type { ChangeEvent } from 'react'

type ProductFormFieldProps = {
  label: string
  name: string
  type?: 'text' | 'number'
  value: string | number
  placeholder: string
  error?: string
  isPrimary?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const labelClass = 'block text-[12px] font-medium leading-[16px] text-black'
const inputClass =
  'mt-[5px] h-[30px] w-full rounded-[7px] border px-[10px] text-[12px] leading-[16px] text-black outline-none placeholder:text-[#98A2B3]'

const ProductFormField = ({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  error,
  isPrimary = false,
  onChange,
}: ProductFormFieldProps) => {
  const borderClass = error
    ? 'border-red-500'
    : isPrimary
      ? 'border-[#BFC8FF]'
      : 'border-[#E5E7EB]'

  return (
    <label className={labelClass}>
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClass} ${borderClass}`}
      />
      {error ? <p className="mt-[3px] text-[10px] text-red-500">{error}</p> : null}
    </label>
  )
}

export default ProductFormField
