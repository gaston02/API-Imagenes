import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
        required: true,
      },
    ],
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
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
