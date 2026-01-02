import mongoose from "mongoose";

const carOptionSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    interior: [{ name: String, color: String, price: Number }],
    size: [{ size: String, type: String, price: Number }],
    trims: [{ name: String, price: Number }],
    package: [{ name: String, price: Number }],
    colors: [{ color: String, price: Number }],
  },
  { timestamps: true }
);

export default mongoose.model("CarOption", carOptionSchema);
