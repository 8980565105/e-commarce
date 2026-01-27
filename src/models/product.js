
import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  size: String,
  stock: Number,
  variantPrice: Number,
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    images: [String],
    variants: [VariantSchema],

  
    status: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
