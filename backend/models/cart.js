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
        selectOptions: new mongoose.Schema(
          {
            color: { name: String, hex: String, price: Number },
            wheels: { type: mongoose.Schema.Types.Mixed },
            interior: { name: String, color: String, price: Number },
            trim: { name: String, price: Number },
            packages: [{ name: String, price: Number }],
          },
          { _id: false }
        ),
        quantity: {
          type: Number,
          default: 1,
        },
        unitPrice: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchemea);
