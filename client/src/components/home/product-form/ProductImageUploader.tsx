import type { ChangeEvent } from 'react'

export type PreviewImage = {
  id: string
  src: string
  file?: File
}

type ProductImageUploaderProps = {
  images: PreviewImage[]
  fileInputKey: number
  error?: string
  onImagesChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (id: string) => void
}

const labelClass = 'block text-[12px] font-medium leading-[16px] text-black'

const ProductImageUploader = ({
  images,
  fileInputKey,
  error,
  onImagesChange,
  onRemoveImage,
}: ProductImageUploaderProps) => {
  return (
    <section>
      <section className="flex items-center justify-between">
        <p className={labelClass}>Upload Product Images</p>
        <label className="cursor-pointer text-[11px] font-semibold leading-[16px] text-black">
          Add More Photos
          <input
            key={fileInputKey}
            multiple
            type="file"
            accept="image/*"
            onChange={onImagesChange}
            className="hidden"
          />
        </label>
      </section>

      <section
        className={`mt-[5px] flex min-h-[44px] w-full items-center gap-[7px] rounded-[7px] border border-dashed p-[6px] ${
          error ? 'border-red-500' : 'border-[#E5E7EB]'
        }`}
      >
        {images.length > 0 ? (
          images.map((image) => (
            <section key={image.id} className="relative h-[32px] w-[32px]">
              <img
                src={image.src}
                alt="Product preview"
                className="h-full w-full rounded-[4px] border border-[#E5E7EB] object-cover"
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onRemoveImage(image.id)
                }}
                className="absolute right-[-5px] top-[-5px] flex h-[14px] w-[14px] cursor-pointer items-center justify-center rounded-full bg-white text-[10px] leading-none text-black shadow"
              >
                ×
              </button>
            </section>
          ))
        ) : (
          <label className="flex flex-1 cursor-pointer flex-col items-center justify-center text-center">
            <span className="text-[12px] leading-[16px] text-[#98A2B3]">Enter Description</span>
            <span className="text-[12px] font-semibold leading-[16px] text-black">Browse</span>
            <input
              key={fileInputKey}
              multiple
              type="file"
              accept="image/*"
              onChange={onImagesChange}
              className="hidden"
            />
          </label>
        )}
      </section>

      {error ? <p className="mt-[3px] text-[10px] text-red-500">{error}</p> : null}
    </section>
  )
}

export default ProductImageUploader
