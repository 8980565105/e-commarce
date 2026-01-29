import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
  },
  paymentDetails: {
    method: String,
    status: { type: String, default: "Pending" },
  },
  items: [
    {
      productId: String,
      title: String,
      price: Number,
      quantity: Number,
      size: String,
      color: String,
      image: String,
    },
  ],
  subtotal: Number,
  shippingFee: Number,
  tax: Number,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
