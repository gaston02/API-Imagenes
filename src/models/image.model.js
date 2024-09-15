import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    public: {
      type: Boolean,
      required: true,
      default: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gallery: {
      type: Schema.Types.ObjectId,
      ref: "Gallery",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
