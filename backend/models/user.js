import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    preferences: {
      favoriteModels: [
        {
          carId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
          },
          modelName: String,
          modelColor: String,
        },
      ],
      preferredColors: { type: [String], default: [] },
    },
    savedConfiguration: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
