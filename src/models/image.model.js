import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      index: true,
    },
    gallery: {
      type: Schema.Types.ObjectId,
      ref: "Gallery",
      required: false,
    },
  },
  { timestamps: true }
);

imageSchema.index({ user: 1 });


export default mongoose.model("Image", imageSchema);
