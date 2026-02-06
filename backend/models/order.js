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
        image: {
          type: String,
          required: true,
        },
        selectOptions: {
          color: { name: String, hex: String, price: Number },
          wheels: mongoose.Schema.Types.Mixed,
          interior: { name: String, color: String, price: Number },
          trim: { name: String, price: Number },
          packages: [{ name: String, price: Number }],
        },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Canceled",
      ],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid", "Refunded"],
      default: "Unpaid",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: false,
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      country: String,
      zipCode: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
