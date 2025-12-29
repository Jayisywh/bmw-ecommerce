import mongoose from "mongoose";

const cartSchemea = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: [
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
          color: { type: String },
          interior: { name: String, color: String, price: Number },
          wheels: { size: String, type: String, price: Number },
          trim: { name: String, price: Number },
          packages: [{ name: String, price: Number }],
        },
        quantity: {
          type: Number,
          default: 1,
        },
        totalPrice: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchemea);
