import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export default function Input({ className = '', type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={`h-10 w-full rounded-lg border border-[#D4D4D4] bg-white px-3 text-sm font-normal text-black outline-none placeholder:text-[#98A2B3] focus:border-[#071074] ${className}`}
      {...props}
    />
  )
}
