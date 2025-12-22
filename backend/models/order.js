import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        carId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Car",
          required: true,
        },
        selectOptions: {
          color: { type: String },
          interior: { name: String, color: String, price: Number },
          wheels: { size: String, type: String, price: Number },
          trim: { name: String, price: Number },
        },
        packages: [{ name: String, price: Number }],
        quantity: { type: Number },
        totalPrice: { type: Number },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Completed", "Canceled"],
      default: "Pending",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
