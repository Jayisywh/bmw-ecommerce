import mongoose from "mongoose";

// Define sub-schemas explicitly to ensure proper validation
const interiorSchema = new mongoose.Schema(
  {
    name: { type: String },
    color: { type: String },
    price: { type: Number },
  },
  { _id: false }
);

const sizeSchema = new mongoose.Schema(
  {
    size: { type: String },
    type: { type: String },
    price: { type: Number },
  },
  { _id: false }
);

const trimSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
  },
  { _id: false }
);

const colorSchema = new mongoose.Schema(
  {
    color: { type: String },
    price: { type: Number },
  },
  { _id: false }
);

const carOptionSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    interior: {
      type: [interiorSchema],
      default: [],
    },
    size: {
      type: [sizeSchema],
      default: [],
    },
    trims: {
      type: [trimSchema],
      default: [],
    },
    package: {
      type: [packageSchema],
      default: [],
    },
    colors: {
      type: [colorSchema],
      default: [],
    },
  },
  { 
    timestamps: true,
    strict: true // Ensure strict mode for proper validation
  }
);

export default mongoose.model("CarOption", carOptionSchema);
