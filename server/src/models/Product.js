import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    quantityStock: { type: Number, required: true },
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    brandName: { type: String, required: true, trim: true },
    images: [{ type: String }],
    exchangeEligible: { type: Boolean, default: false },
    returnEligible: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)