import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    series: { type: String },
    price: { type: Number, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    engineType: { type: String },
    horsePower: { type: String },
    colors: {
      type: [String],
    },
    images: {
      type: [String],
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
